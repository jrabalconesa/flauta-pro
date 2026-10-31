'use client';
import {useEffect,useRef,useState} from 'react';
import {request} from '../lib/platform';
import {validateBackup,Backup} from '../lib/backup';
import {EXERCISES} from '../lib/catalog';
import {SITES_ORIGIN,PAGES_ORIGIN,SYNC_CHANNEL,SYNC_EVENT,acceptsMessage,synchronize} from '../lib/sync-protocol';
const ids=EXERCISES.map(e=>e.id);
async function json(path:string,options?:RequestInit){const r=await request(path,options);const d=await r.json();if(!r.ok)throw Error((d as any).error||'No se pudo acceder a los datos.');return d;}
export default function SyncPanel({onSynced}:{onSynced:()=>Promise<void>}){
 const [pages,setPages]=useState(false),[state,setState]=useState('off'),[status,setStatus]=useState(''),[last,setLast]=useState('');
 const controls=useRef<{connect:()=>void;stop:()=>void;run:()=>void}|null>(null),callback=useRef(onSynced);callback.current=onSynced;
 useEffect(()=>{
  if(location.origin!==PAGES_ORIGIN)return;setPages(true);
  let popup:Window|null=null,token='',approved=false,stopped=false,busy=false,queued=false,helloTimer:ReturnType<typeof setInterval>|undefined;
  let nextId=0,pending:{id:number;resolve:(v:Backup)=>void;reject:(e:Error)=>void;timer:ReturnType<typeof setTimeout>}|null=null;
  const post=(data:any)=>popup?.postMessage({channel:SYNC_CHANNEL,token,...data},SITES_ORIGIN);
  function stop(){approved=false;stopped=true;token='';if(helloTimer)clearInterval(helloTimer);if(pending){clearTimeout(pending.timer);pending.reject(Error('Conexión cerrada.'));pending=null;}if(popup&&!popup.closed)popup.close();popup=null;setState('off');setStatus('Desconectado. Tus datos guardados se conservan.');}
  async function run(){
   if(!approved||stopped)return;if(busy){queued=true;return;}if(!navigator.onLine){setState('paused');setStatus('Sin Internet. El progreso sigue guardándose en este navegador.');return;}
   if(!popup||popup.closed){stop();setStatus('Ventana de Sites cerrada. Conecta de nuevo para continuar.');return;}
   busy=true;queued=false;setState('syncing');const runToken=token;
   try{
    let changed=false;
    await synchronize(async()=>validateBackup(await json('/api/backup'),ids),backup=>new Promise<Backup>((resolve,reject)=>{
     if(stopped||token!==runToken){reject(Error('Conexión cerrada.'));return;}
     const id=++nextId;const timer=setTimeout(()=>{pending=null;reject(Error('Sites no responde. Revisa la ventana de conexión o vuelve a conectar.'));},20000);pending={id,resolve,reject,timer};post({type:'exchange',id,backup});
    }),async backup=>{if(stopped||token!==runToken)return;const result:any=await json('/api/backup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(backup)});changed=result.duplicates<backup.rows.length;});
    if(stopped||token!==runToken)return;if(changed)await callback.current();setLast(new Date().toLocaleTimeString('es-ES'));setState('connected');setStatus('Perfil, prácticas y sesión AIA sincronizados.');
   }catch(e){if(!stopped&&token===runToken){setState('paused');setStatus((e as Error).message+' Tus datos locales se conservan; se reintentará automáticamente.');}}
   finally{busy=false;if(queued&&!stopped)void run();}
  }
  function receive(e:MessageEvent){
   if(!acceptsMessage(e,SITES_ORIGIN,popup,token))return;const d=e.data;
   if(d.type==='ready'){approved=true;if(helloTimer)clearInterval(helloTimer);void run();}
   else if(d.type==='revoked'){stop();setStatus('Conexión finalizada desde Sites.');}
   else if(pending&&d.id===pending.id&&(d.type==='result'||d.type==='error')){const p=pending;pending=null;clearTimeout(p.timer);try{if(d.type==='error')throw Error(typeof d.error==='string'?d.error:'Error de Sites.');p.resolve(validateBackup(d.backup,ids));}catch(err){p.reject(err as Error);}}
  }
  function connect(){
   stop();stopped=false;token=Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
   popup=window.open(SITES_ORIGIN+'/sync#'+token,'_blank','popup,width=620,height=760');
   if(!popup){setStatus('El navegador ha bloqueado la ventana. Permite ventanas emergentes para conectar con Sites.');return;}
   setState('waiting');setStatus('En la ventana de Sites, inicia sesión si hace falta y revisa la autorización.');
   const currentToken=token;const started=Date.now();
   const hello=async()=>{if(stopped||token!==currentToken)return;if(popup?.closed){stop();return;}if(Date.now()-started>180000){stop();setStatus('La autorización ha caducado. Vuelve a conectar.');return;}try{const b=validateBackup(await json('/api/backup'),ids);if(token===currentToken)post({type:'hello',profile:b.rows.find(r=>r.kind==='profile')?.name||'Sin perfil guardado',attempts:b.rows.filter(r=>r.kind==='attempt').length});}catch{setStatus('No se pudo leer el progreso local. Conserva una copia JSON antes de reintentar.');}};
   void hello();helloTimer=setInterval(()=>void hello(),1500);
  }
  const timer=setInterval(()=>void run(),15000);const saved=()=>{if(!busy)void run();else queued=true;};
  window.addEventListener('message',receive);window.addEventListener('online',saved);window.addEventListener(SYNC_EVENT,saved);controls.current={connect,stop,run:()=>void run()};
  return()=>{stop();clearInterval(timer);window.removeEventListener('message',receive);window.removeEventListener('online',saved);window.removeEventListener(SYNC_EVENT,saved);controls.current=null;};
 },[]);
 return <section className="card pro-auto-sync" aria-labelledby="auto-sync-title"><h2 id="auto-sync-title">Sincronización entre dispositivos · Prueba</h2>{pages?<><p>Conecta este navegador a tu cuenta de Sites para combinar automáticamente perfil, prácticas y sesión AIA. Revisa que los dos perfiles correspondan a la misma persona. Conserva abierta la ventana de conexión; al cerrarla tendrás que reconectar.</p><div className="backup-actions">{state==='off'?<button className="secondary" onClick={()=>controls.current?.connect()}>Conectar con Sites</button>:<><button className="secondary" disabled={state==='waiting'||state==='syncing'} onClick={()=>controls.current?.run()}>Sincronizar ahora</button><button className="secondary" onClick={()=>controls.current?.stop()}>Desconectar</button></>}</div><p role="status">{status||'Sin conexión automática. Puedes seguir usando las copias JSON.'}{last&&state!=='off'?' Última sincronización: '+last+'.':''}</p><small>Sin Internet, continúa guardando aquí. Se reintentará al recuperar conexión mientras Sites siga abierto. Los PDF, imágenes y grabaciones quedan fuera.</small></>:<p>Tu cuenta guarda los datos de Sites. Para conectarla con otro dispositivo, abre <a href="https://jrabalconesa.github.io/flauta-pro/#profesor" target="_blank" rel="noreferrer">Flauta PRO en GitHub Pages</a> en ese dispositivo y pulsa «Conectar con Sites». La autorización se revisa en una ventana de tu cuenta. Las copias JSON siguen disponibles.</p>}</section>;
}

import {EXERCISES} from './catalog';
import {canonicalLocalRows} from './local-records';
import {makeBackup,validateBackup,mergeBackup,recordKey,MAX_BACKUP_BYTES} from './backup';
// GitHub Pages has no server. Keep this edition's records in this browser.
let database: Promise<IDBDatabase> | undefined;
const urls = new Map<string, string>();
function db() {
  return database ||= new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('flauta-pro-pages', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('records', {keyPath: 'id'});
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => { database = undefined; reject(request.error); };
  });
}
async function records() {
  const database = await db();
  return new Promise<any[]>((resolve, reject) => {
    const request = database.transaction('records').objectStore('records').getAll();
    request.onsuccess = () => resolve(canonicalLocalRows(request.result));
    request.onerror = () => reject(request.error);
  });
}
async function mutate(action: 'put'|'delete', value: any) {
  const database = await db();
  return new Promise<void>((resolve, reject) => {
    const tx = database.transaction('records', 'readwrite');
    tx.objectStore('records')[action](value);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || Error('No se pudo guardar.'));
  });
}
export async function localFetch(path: string, options: RequestInit = {}) {
  try {
    const method = options.method || 'GET';
    if (path === '/api/backup') {
      const ids=EXERCISES.map(e=>e.id);
      if(method==='GET')return Response.json(makeBackup(await records(),ids));
      if(method!=='POST')return Response.json({error:'Método no permitido'},{status:405});
      if(String(options.body).length>MAX_BACKUP_BYTES)throw Error('La copia supera el máximo de 2 MB.');
      const backup=validateBackup(JSON.parse(String(options.body)),ids);
      const database=await db();
      const result=await new Promise<any>((resolve,reject)=>{
        const tx=database.transaction('records','readwrite'),store=tx.objectStore('records');
        const request=store.getAll();let merged:any;
        request.onsuccess=()=>{try{merged=mergeBackup(canonicalLocalRows(request.result),backup);for(const row of merged.writes)store.put({...row,id:recordKey(row)});}catch(e){tx.abort();reject(e);}};
        tx.oncomplete=()=>resolve(merged);
        tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Importación cancelada. No se guardó ningún dato.'));
      });
      return Response.json({ok:true,attemptsAdded:result.attemptsAdded,duplicates:result.duplicates});
    }
    if (path === '/api/state') {
      if (method === 'GET') return Response.json({rows:(await records()).filter(r=>['profile','attempt','session'].includes(r.kind))});
      const {kind,value} = JSON.parse(String(options.body));
      if (!['profile','attempt','session'].includes(kind) || !value) throw Error('Datos no válidos.');
      const payload={...value,kind,date:Date.now()};if(kind==='attempt'&&!payload.attemptId)payload.attemptId=crypto.randomUUID();const id=recordKey(payload);
      const checked=validateBackup({app:'flauta-pro',version:2,exportedAt:Date.now(),rows:[payload]},EXERCISES.map(e=>e.id)).rows[0];await mutate('put',{...checked,id});
      return Response.json({ok:true,id});
    }
    if (path === '/api/recordings') {
      if(method==='GET'){
        const recordings=(await records()).filter(r=>r.kind==='recording').map(({blob,...row})=>{
          if(!urls.has(row.id))urls.set(row.id,URL.createObjectURL(blob));
          return {...row,url:urls.get(row.id)};
        });return Response.json({recordings});
      }
      if(method==='DELETE'){
        const {id}=JSON.parse(String(options.body));
        if(!(await records()).some(r=>r.id===id&&r.kind==='recording'))throw Error('Grabación no encontrada.');
        await mutate('delete',id);if(urls.has(id))URL.revokeObjectURL(urls.get(id)!);urls.delete(id);return Response.json({ok:true});
      }
      if(method!=='POST')return Response.json({error:'Método no permitido'},{status:405});
      const data=options.body as FormData,file=data.get('file') as File,metadata=JSON.parse(String(data.get('metadata')));
      if(!file||file.size<16||file.size>12*1024*1024)throw Error('La grabación debe ocupar entre 16 bytes y 12 MB.');
      const type=file.type.split(';')[0];if(!['audio/webm','audio/mp4','audio/ogg'].includes(type))throw Error('Formato de audio no compatible.');
      const rows=await records(),profile=rows.find(r=>r.kind==='profile');
      const learners=profile?.learners||[{id:'default',instrumentId:'flute-1'}];
      if(!metadata||!EXERCISES.some(e=>e.id===metadata.exerciseId)||!learners.some((l:any)=>l.id===metadata.profileId&&l.instrumentId===metadata.instrumentId))throw Error('Datos de práctica no válidos.');
      if(rows.filter(r=>r.kind==='recording').length>=100)throw Error('Ya hay 100 grabaciones. Descarga alguna para guardar otra.');
      const a=new Uint8Array(await file.arrayBuffer()),text=new TextDecoder();
      if(!(type==='audio/webm'&&a[0]===0x1a&&a[1]===0x45&&a[2]===0xdf&&a[3]===0xa3||type==='audio/ogg'&&text.decode(a.slice(0,4))==='OggS'||type==='audio/mp4'&&text.decode(a.slice(4,8))==='ftyp'))throw Error('El archivo no coincide con su formato.');
      await mutate('put',{id:crypto.randomUUID(),kind:'recording',blob:file,type,size:file.size,date:Date.now(),profileId:metadata.profileId,instrumentId:metadata.instrumentId,exerciseId:metadata.exerciseId});
      return Response.json({ok:true});
    }
    if (path === '/api/files') {
      if (method === 'GET') {
        const files = (await records()).filter(r=>r.kind==='file').map(({blob,...row})=>{
          if(!urls.has(row.id)) urls.set(row.id,URL.createObjectURL(blob));
          return {...row,url:urls.get(row.id)};
        });
        return Response.json({files});
      }
      if (method === 'DELETE') {
        const {id}=JSON.parse(String(options.body));
        await mutate('delete',id);
        if(urls.has(id)) URL.revokeObjectURL(urls.get(id)!);
        urls.delete(id);
        return Response.json({ok:true});
      }
      const file = (options.body as FormData).get('file') as File;
      if(!file || !['application/pdf','image/png','image/jpeg','image/webp'].includes(file.type) || file.size>12*1024*1024) throw Error('Usa un PDF o imagen de hasta 12 MB.');
      const a=new Uint8Array(await file.arrayBuffer());
      const valid=file.type==='application/pdf'?new TextDecoder().decode(a.slice(0,5))==='%PDF-':file.type==='image/png'?a[0]===137&&a[1]===80:file.type==='image/jpeg'?a[0]===255&&a[1]===216:new TextDecoder().decode(a.slice(0,4))==='RIFF';
      if(!valid) throw Error('El contenido no coincide con el tipo de archivo.');
      await mutate('put',{id:crypto.randomUUID(),kind:'file',filename:file.name,title:file.name,type:file.type,blob:file,status:'Requiere validación manual',date:Date.now()});
      return Response.json({ok:true});
    }
    return Response.json({error:'Recurso no disponible.'},{status:404});
  } catch(error) {
    return Response.json({error:error instanceof Error ? error.message : 'No se pudo acceder al almacenamiento de este navegador.'},{status:400});
  }
}

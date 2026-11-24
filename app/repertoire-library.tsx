'use client';
import {useEffect,useRef,useState} from 'react';
import {asset} from '../lib/platform';
import catalogue from '../lib/cancionero-v93.json';
import type {SongStudy} from '../lib/learners';
import {studyZip,type ZipEntry} from '../lib/study-download';


type Song=typeof catalogue.songs[number];
type Props={studies:Record<string,SongStudy>;onSave:(songs:Record<string,SongStudy>)=>Promise<void>;busy:boolean};
const empty:SongStudy={status:'Sin empezar',style:'Sin clasificar',meter:'Sin clasificar',type:'Canción'};
const statuses=['Sin empezar','En aprendizaje','Aprendida','Necesita repaso'];
const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const url=(p:string)=>asset(p.split('/').map(encodeURIComponent).join('/'));
const noteNames=['DO','DO♯','RE','MI♭','MI','FA','FA♯','SOL','SOL♯','LA','SI♭','SI'];
function noteLabel(midi:number){return noteNames[midi%12]+(midi>=84?' agudo':midi<79?' grave':'');}
function SongPanel({song,previous,next,onClose,study,onUpdate,busy}:{song:Song;previous?:()=>void;next?:()=>void;onClose:()=>void;study:SongStudy;onUpdate:(value:Partial<SongStudy>)=>void;busy:boolean}){
 const [speed,setSpeed]=useState('080'),[loop,setLoop]=useState(false),[viewer,setViewer]=useState(false),[error,setError]=useState('');
 const player=useRef<HTMLAudioElement>(null),panel=useRef<HTMLElement>(null);
 const audios=song.audio as Record<string,string>,midis=song.midi as Record<string,string>;
 useEffect(()=>{panel.current?.scrollIntoView({behavior:'smooth',block:'start'});const audio=player.current;return()=>{audio?.pause();};},[song.id]);
 return <article className="card v93-song-panel" ref={panel} aria-label={'Ficha de '+song.title}>
  <div className="section-title"><div><span className="pill">{song.kind==='active'?'Ficha de estudio':'Anexo del manual'}</span><h3>{song.title}</h3></div><button className="secondary" onClick={onClose}>Cerrar ficha</button></div>
  <p>{song.group} · Digitación alemana · {song.meters.join(', ')}</p>
  <p className="v93-scope">{song.scope}</p>
  <p><strong>Notas necesarias:</strong> {song.notes.map(noteLabel).join(' · ')}</p>
  <section aria-label="Escucha de referencia" className="v93-listening"><h4>Escucha la flauta dulce</h4>
   {Object.keys(audios).length? <><div className="practice-next-actions"><label>Velocidad de referencia<select aria-label="Velocidad de referencia del cancionero" value={speed} onChange={e=>{player.current?.pause();setError('');setSpeed(e.target.value);}}><option value="060">60 % · Lento</option><option value="080">80 % · Práctica</option><option value="100">100 % · Normal</option></select></label><label className="v93-check"><input type="checkbox" checked={loop} onChange={e=>setLoop(e.target.checked)}/>Repetir audio</label></div>
   <audio key={speed} ref={player} controls preload="none" loop={loop} src={url(audios[speed])} aria-label={'Flauta dulce: '+song.title+' al '+Number(speed)+' %'} onPlay={e=>{const current=e.currentTarget;current.playbackRate=1;document.querySelectorAll('audio').forEach(a=>{if(a!==current)a.pause();});}} onCanPlay={()=>setError('')} onError={()=>setError('No se pudo cargar este audio. Comprueba la conexión o descarga el archivo.')} />
   {error&&<p role="alert">{error}</p>}<a href={url(audios[speed])} download>Descargar MP3 al {Number(speed)} %</a></>:<p>Esta variante conserva su partitura y sus MIDI. Escucha la ficha principal para usar su referencia de audio.</p>}
   <p className="v93-caption">Sonido de flauta dulce con muestras FreePats. Escuchar no registra una práctica con micrófono.</p>
  </section>
  <div className="practice-next-actions"><button className="primary" aria-expanded={viewer} onClick={()=>setViewer(!viewer)}>{viewer?'Ocultar ficha PDF':'Ver ficha con partitura y tablatura'}</button><a className="secondary" href={url(song.pdf)} target="_blank" rel="noreferrer">Abrir PDF en otra pestaña</a><a className="secondary" href={url(song.pdf)} download>Descargar PDF</a><a className="secondary" href={url(song.xml)} download>MusicXML para MuseScore</a></div>
  {viewer&&<div className="v93-pdf-viewer"><iframe title={'Partitura, tablatura y digitación de '+song.title} src={url(song.pdf)+'#view=FitH'} loading="lazy"/><p>Si tu navegador no muestra todas las páginas, utiliza «Abrir PDF en otra pestaña».</p></div>}
  <div className="v93-midi"><strong>MIDI:</strong>{Object.entries(midis).sort(([a],[b])=>Number(a)-Number(b)).map(([s,path])=><a key={s} href={url(path)} download>{Number(s)} %</a>)}</div>
  <p><a href={url(catalogue.manual)+'#page='+song.page} target="_blank" rel="noreferrer">Ver esta canción en el cancionero completo · página {song.page}</a></p>
  {song.studyKey&&<div className="v93-study"><label>Mi estado de estudio<select value={study.status} disabled={busy} onChange={e=>onUpdate({status:e.target.value})}>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><p>Tu valoración se guarda en el perfil activo. Puedes escuchar y estudiar estas fichas; la medición con micrófono sigue disponible en los ejercicios interactivos.</p></div>}
  <div className="practice-next-actions"><button className="secondary" disabled={!previous} onClick={previous}>Ficha anterior</button><button className="secondary" disabled={!next} onClick={next}>Ficha siguiente</button></div>
 </article>;
}

export default function RepertoireLibrary(props:Props){
 const {studies,onSave,busy}=props;
 const [query,setQuery]=useState(''),[group,setGroup]=useState('Todas'),[kind,setKind]=useState('active'),[status,setStatus]=useState('Todos'),[pitch,setPitch]=useState('Todas'),[meter,setMeter]=useState('Todos'),[selected,setSelected]=useState<string|null>(null),[message,setMessage]=useState(''),[downloading,setDownloading]=useState(''),[downloadMessage,setDownloadMessage]=useState('');
 const songs=catalogue.songs;
 const filtered=songs.filter(s=>s.kind===kind&&(group==='Todas'||s.group===group)&&norm([s.title,...s.aliases,s.scope].join(' ')).includes(norm(query))&&(status==='Todos'||(s.studyKey?studies[s.studyKey]?.status||'Sin empezar':'Sin empezar')===status)&&(pitch==='Todas'||s.notes.includes(Number(pitch)))&&(meter==='Todos'||s.meters.includes(meter)));
 const song=filtered.find(s=>s.id===selected),index=filtered.findIndex(s=>s.id===selected);
 function reset(){setQuery('');setGroup('Todas');setStatus('Todos');setPitch('Todas');setMeter('Todos');setSelected(null);setMessage('');}
 async function update(value:Partial<SongStudy>){if(!song?.studyKey)return;try{await onSave({...Object.fromEntries(Object.entries(studies).filter(([key])=>songs.some(s=>s.studyKey===key))),[song.studyKey]:{...(studies[song.studyKey]||empty),...value}});setMessage('Estado de estudio guardado en tu perfil.');}catch(e){setMessage((e as Error).message);}}
 async function downloadGroup(pack:typeof catalogue.packages[number]){
  if(downloading)return;setDownloading(pack.filename);setDownloadMessage('Preparando la descarga…');
  try{
   const entries:ZipEntry[]=new Array(pack.files.length);let cursor=0,done=0;
   await Promise.all(Array.from({length:4},async()=>{while(cursor<pack.files.length){const i=cursor++,file=pack.files[i];let response:Response|undefined;for(let attempt=0;attempt<3;attempt++){try{response=await fetch(url(file.path));if(response.ok)break;}catch{response=undefined;}if(attempt<2)await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));}if(!response?.ok){console.error('Study group download failed',response?.status,file.path);throw Error('No se pudo completar la descarga del grupo');}entries[i]={name:file.name,bytes:new Uint8Array(await response.arrayBuffer())};done++;setDownloadMessage('Preparando '+pack.group+': '+done+' de '+pack.files.length+' archivos.');}}));
   entries.push({name:'LEEME.txt',bytes:new TextEncoder().encode('Flauta PRO v93 · '+pack.group+'\nPDF, MusicXML y MIDI. Los MP3 se escuchan y descargan desde cada ficha de Sites. Digitación alemana.\n')});
   const href=URL.createObjectURL(studyZip(entries)),link=document.createElement('a');link.href=href;link.download=pack.filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),60000);setDownloadMessage('Paquete preparado: '+pack.group+'.');
  }catch(e){setDownloadMessage((e as Error).message+'. Vuelve a intentarlo.');}finally{setDownloading('');}
 }
 return <section className="card references v93-library" aria-label="Cancionero Flauta PRO v93">
  <span className="eyebrow muted">MI CANCIONERO · V93</span><h2>116 fichas para tocar y disfrutar</h2><p>Partitura, nombres de notas, digitación alemana y sonido de flauta dulce a tres velocidades. Cada ficha indica si recoge una melodía, un fragmento o una adaptación.</p>
  <div className="practice-next-actions"><a className="primary" href={url(catalogue.manual)} target="_blank" rel="noreferrer">Abrir cancionero completo · 285 páginas</a><a className="secondary" href={url(catalogue.manual)} download>Descargar cancionero PDF</a><a className="secondary" href={url('/cancionero-v93/Indice_y_catalogo_v93.csv')} download>Descargar índice CSV</a></div>
  <details className="v93-downloads"><summary>Descargar paquetes de estudio por grupo</summary><p>Incluyen las fichas PDF, MusicXML y MIDI. Los audios se escuchan y descargan desde cada ficha.</p><div className="v93-packages">{catalogue.packages.map(p=><button className="secondary" key={p.filename} disabled={!!downloading} onClick={()=>void downloadGroup(p)}>{downloading===p.filename?'Preparando… ':''}{p.group}{p.parts>1?' · Parte '+p.part+' de '+p.parts:''} · {(p.bytes/1e6).toFixed(1)} MB</button>)}</div>{downloadMessage&&<p role="status">{downloadMessage}</p>}</details>
  <div className="note-stage-buttons" role="group" aria-label="Edición del cancionero">{[['active','Fichas de estudio · 116'],['archive','Anexo del manual · 3']].map(([value,label])=><button key={value} aria-pressed={kind===value} className={kind===value?'selected':''} onClick={()=>{setKind(value);reset();}}>{label}</button>)}</div>
  {kind==='archive'&&<p className="v93-scope">Material conservado con cuestiones de identificación o transcripción pendientes. Cada ficha explica su alcance.</p>}
  <label>Buscar en el cancionero<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Título o nombre alternativo"/></label>
  <div className="repertoire-filters"><label>Grupo de estudio<select value={group} onChange={e=>setGroup(e.target.value)}><option>Todas</option>{catalogue.groups.map(g=><option key={g}>{g}</option>)}</select></label><label>Estado de estudio<select value={status} onChange={e=>setStatus(e.target.value)}><option>Todos</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><label>Nota necesaria<select value={pitch} onChange={e=>setPitch(e.target.value)}><option>Todas</option>{[...new Set(songs.flatMap(s=>s.notes))].sort((a,b)=>a-b).map(n=><option key={n} value={n}>{noteLabel(n)}</option>)}</select></label><label>Compás<select value={meter} onChange={e=>setMeter(e.target.value)}><option>Todos</option>{[...new Set(songs.flatMap(s=>s.meters))].sort().map(m=><option key={m}>{m}</option>)}</select></label></div>
  <button className="text-button" onClick={reset}>Limpiar filtros</button><p role="status">{filtered.length} {filtered.length===1?'ficha encontrada':'fichas encontradas'}</p>
  {song&&<SongPanel key={song.id} song={song} study={song.studyKey?studies[song.studyKey]||empty:empty} onUpdate={v=>void update(v)} busy={busy} onClose={()=>setSelected(null)} previous={index>0?()=>setSelected(filtered[index-1].id):undefined} next={index<filtered.length-1?()=>setSelected(filtered[index+1].id):undefined}/>}
  {message&&<p role="status">{message}</p>}
  <div className="repertoire-grid">{filtered.map(s=><button key={s.id} className="card repertoire" aria-pressed={s.id===selected} onClick={()=>{setSelected(s.id);setMessage('');}}><span className="pill">{s.group}</span><h3>{s.title}</h3><p>{s.notes.map(noteLabel).join(' · ')}</p><small>{s.meters.join(', ')} · {s.studyKey?studies[s.studyKey]?.status||'Sin empezar':'Anexo del manual'}</small><span className="text-button">Abrir ficha y escuchar</span></button>)}</div>
  {!filtered.length&&<p>No hay coincidencias. Prueba a limpiar los filtros.</p>}
  <p className="v93-caption">Los grupos organizan el nuevo cancionero. Los ejercicios del recorrido interactivo siguen disponibles debajo. <a href={url('/cancionero-v93/FUENTE_AUDIO.txt')} target="_blank" rel="noreferrer">Fuente y licencia de las muestras de flauta</a>.</p>
 </section>;
}
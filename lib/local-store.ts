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
    request.onsuccess = () => resolve(request.result.sort((a,b) => b.date-a.date));
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
    if (path === '/api/state') {
      if (method === 'GET') return Response.json({rows:(await records()).filter(r=>r.kind!=='file')});
      const {kind,value} = JSON.parse(String(options.body));
      if (!['profile','attempt','session'].includes(kind) || !value) throw Error('Datos no válidos.');
      const id = kind === 'attempt' ? 'attempt_'+(value.attemptId || crypto.randomUUID()) : kind;
      await mutate('put', {...value,id,kind,date:Date.now()});
      return Response.json({ok:true,id});
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

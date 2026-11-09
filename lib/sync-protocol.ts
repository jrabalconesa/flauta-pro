export const SITES_ORIGIN='https://flauta-pro.joserabalconesa.chatgpt.site';
export const PAGES_ORIGIN='https://jrabalconesa.github.io';
export const SYNC_CHANNEL='flauta-pro-sync-v1';
export const SYNC_EVENT='flauta-pro-data-saved';
// The existing pilot authorizes one pair of profiles, not a whole multi-user
// inventory. Keep additional learners outside the bridge until it is validated.
export function pilotProfile(backup:{rows:Record<string,any>[]}){
 const profile=backup.rows.find(r=>r.kind==='profile');
 if(!profile)throw Error('Guarda un perfil antes de conectar con Sites.');
 if(profile.learners&&(!Array.isArray(profile.learners)||profile.learners.length!==1||profile.learners[0].id!=='default')||backup.rows.some(r=>['attempt','session'].includes(r.kind)&&r.profileId&&r.profileId!=='default'))throw Error('El piloto conecta un único perfil principal. Las copias con varios perfiles se trasladan por JSON, revisando sus usuarios.');
 const name=profile.learners?.[0]?.name||profile.name;
 if(typeof name!=='string'||!name.trim())throw Error('Guarda un nombre de perfil antes de conectar.');
 return {name,key:JSON.stringify(['default',name])};
}
export function validToken(value:unknown):value is string{return typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);}
export function acceptsMessage(event:{origin:string;source:unknown;data:any},origin:string,source:unknown,token:string){
 const d=event.data;return !!source&&event.source===source&&event.origin===origin&&validToken(token)&&d?.channel===SYNC_CHANNEL&&d?.token===token;
}
// Every destination merges instead of replacing. A local save made during the
// remote request survives the final local merge and is sent on the next pass.
export async function synchronize<T>(readLocal:()=>Promise<T>,exchange:(value:T)=>Promise<T>,mergeLocal:(value:T)=>Promise<void>){
 const local=await readLocal();const remote=await exchange(local);await mergeLocal(remote);
}

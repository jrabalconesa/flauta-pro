export const SITES_ORIGIN='https://flauta-pro.joserabalconesa.chatgpt.site';
export const PAGES_ORIGIN='https://jrabalconesa.github.io';
export const SYNC_CHANNEL='flauta-pro-sync-v1';
export const SYNC_EVENT='flauta-pro-data-saved';
export function validToken(value:unknown):value is string{return typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);}
export function acceptsMessage(event:{origin:string;source:unknown;data:any},origin:string,source:unknown,token:string){
 const d=event.data;return !!source&&event.source===source&&event.origin===origin&&validToken(token)&&d?.channel===SYNC_CHANNEL&&d?.token===token;
}
// Every destination merges instead of replacing. A local save made during the
// remote request survives the final local merge and is sent on the next pass.
export async function synchronize<T>(readLocal:()=>Promise<T>,exchange:(value:T)=>Promise<T>,mergeLocal:(value:T)=>Promise<void>){
 const local=await readLocal();const remote=await exchange(local);await mergeLocal(remote);
}

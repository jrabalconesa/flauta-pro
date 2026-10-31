import {SYNC_EVENT} from './sync-protocol';
import {localFetch} from './local-store';
export async function request(path:string,options?:RequestInit){const response=await localFetch(path,options);if(response.ok&&path==='/api/state'&&options?.method==='POST')window.dispatchEvent(new Event(SYNC_EVENT));return response;}
export const asset=(path:string)=>'.'+path;
export const fileUrl=(file:any)=>file.url;
export const storageNotice='GitHub Pages · Tus datos se guardan en este navegador. En Profesor puedes conectar con tu cuenta de Sites para sincronizar perfil y progreso; también puedes trasladarlos por copia JSON.';
export const savedLocation='este navegador';

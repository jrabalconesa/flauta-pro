import {SYNC_EVENT,SITES_ORIGIN} from './sync-protocol';
import {localFetch} from './local-store';
export async function request(path:string,options?:RequestInit){const response=await localFetch(path,options);if(response.ok&&path==='/api/state'&&options?.method==='POST')window.dispatchEvent(new Event(SYNC_EVENT));return response;}
export const asset=(path:string)=>path.startsWith('/repertorio/')||path.startsWith('/fuentes/cancionero-progresivo')||path.startsWith('/fuentes/partituras-revisadas')?SITES_ORIGIN+path:'.'+path;
export const fileUrl=(file:any)=>file.url;
export const recordingUrl=(recording:any)=>recording.url;
export const storageNotice='GitHub Pages · Tus datos se guardan en este navegador. En Profesor puedes conectar con tu cuenta de Sites para sincronizar el perfil principal y su progreso; también puedes trasladarlos por copia JSON.';
export const savedLocation='este navegador';

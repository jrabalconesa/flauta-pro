import {localFetch} from './local-store';
export const request=localFetch;
export const asset=(path:string)=>'.'+path;
export const fileUrl=(file:any)=>file.url;
export const storageNotice='GitHub Pages · Tus datos se guardan en este navegador. Usa la copia de seguridad para trasladarlos a Sites u otro dispositivo.';
export const savedLocation='este navegador';

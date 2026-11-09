'use client';
import type {SongStudy} from '../lib/learners';
import {SITES_ORIGIN} from '../lib/sync-protocol';

// Platform adapter: personal catalogue, original media and study annotations
// stay in the private Site. Shared, reviewed exercises are available above.
export default function RepertoireLibrary(_props:{studies:Record<string,SongStudy>;onSave:(songs:Record<string,SongStudy>)=>Promise<void>;busy:boolean;onPractice:(id:string)=>void}){
 return <section className="card references"><h2>Cancionero y biblioteca privada</h2><p>Las prácticas revisadas se pueden escuchar y tocar en esta aplicación. El cancionero completo, sus documentos, audios originales y seguimiento personal permanecen en tu cuenta privada de Sites.</p><a className="secondary" href={SITES_ORIGIN+'/#repertorio'} target="_blank" rel="noreferrer">Abrir mi cancionero en Sites privado ↗</a><p>Los perfiles, resultados, archivos y grabaciones que guardes aquí permanecen en este navegador. Las copias JSON siguen disponibles en Profesor; la conexión con Sites requiere tu autorización explícita.</p></section>;
}

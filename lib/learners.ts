export type Instrument={id:string;name:string;system:'barroca'|'alemana'|'yrf21';notes:string};
export type SongStudy={status:string;style:string;meter:string;type:string};
export type Learner={id:string;name:string;system:'barroca'|'alemana';minutes:number;instrumentId:string;songs?:Record<string,SongStudy>};
export const INITIAL_INSTRUMENTS:Instrument[]=[
 {id:'flute-1',name:'Hohner · Flauta dulce',system:'alemana',notes:'Flauta dulce soprano con digitación alemana. Modelo pendiente de confirmar. Para los ejercicios y digitaciones de Flauta PRO.'},
 {id:'flute-2',name:'Yamaha YRF-21 · Pífano',system:'yrf21',notes:'Pífano en DO, de soplo lateral. Utiliza la tabla de digitación específica de Yamaha YRF-21.'}
];
export function recorderSystem(instrument:Instrument|undefined,fallback:Learner['system']):Learner['system']{return 'alemana'}
export function instrumentLabel(instrument:Instrument){return instrument.system==='yrf21'?'Pífano en DO · digitación Yamaha YRF-21':`Flauta dulce soprano · ${instrument.system}`}
// Upgrade only the original unnamed inventory cards; retain IDs and historical practice links.
export function identifyInstrument(instrument:Instrument):Instrument{
 const index=instrument.id==='flute-1'&&instrument.name==='Mi flauta dulce 1'?0:instrument.id==='flute-2'&&instrument.name==='Mi flauta dulce 2'?1:-1;
 return index<0?instrument:{...instrument,...INITIAL_INSTRUMENTS[index],notes:INITIAL_INSTRUMENTS[index].notes+(instrument.notes&&!/^(Primera|Segunda) flauta del proyecto/.test(instrument.notes)?`\nNotas anteriores: ${instrument.notes}`:'')};
}
export function learnerId(row:any){return row.profileId||'default'}
export function learnerSettings(profile:any){
 const instruments:Instrument[]=profile?.instruments?.length?profile.instruments.map(identifyInstrument):INITIAL_INSTRUMENTS.map(i=>({...i}));
 const learners:Learner[]=profile?.learners?.length?profile.learners:[{id:'default',name:profile?.name||'Jose',system:profile?.system||'alemana',minutes:profile?.minutes||10,instrumentId:'flute-1'}];
 return {learners:learners.map(l=>{let instrument=instruments.find(i=>i.id===l.instrumentId);if(instrument?.system==='yrf21')instrument=instruments.find(i=>i.system!=='yrf21');return {...l,instrumentId:instrument?.id||l.instrumentId,system:recorderSystem(instrument,l.system)};}),instruments};
}
export function scopedRows(rows:any[],id:string){return rows.filter(r=>learnerId(r)===id)}
export function sessionKey(userId:string,profileId?:string){return !profileId||profileId==='default'?`session_${userId}`:`session_${userId}_${profileId}`}
export function validateLearners(value:any){
 const id=(s:any)=>typeof s==='string'&&/^[a-zA-Z0-9-]{1,80}$/.test(s);
 if(value.learners!==undefined){if(!Array.isArray(value.learners)||value.learners.length<1||value.learners.length>30||new Set(value.learners.map((x:any)=>x.id)).size!==value.learners.length)throw Error('Lista de perfiles no válida');for(const x of value.learners)if(!id(x.id)||typeof x.name!=='string'||!x.name.trim()||x.name.length>80||!['barroca','alemana'].includes(x.system)||![10,15].includes(x.minutes)||!id(x.instrumentId))throw Error('Perfil no válido');}
 if(value.learners)for(const l of value.learners){if(l.songs!==undefined){if(!l.songs||typeof l.songs!=='object'||Array.isArray(l.songs)||Object.keys(l.songs).length>200)throw Error('Seguimiento de canciones no válido');for(const [k,v] of Object.entries(l.songs) as [string,any][]){if(!/^\d{1,3}$/.test(k)||!v||!['Sin empezar','En aprendizaje','Aprendida','Necesita repaso'].includes(v.status)||![v.style,v.meter,v.type].every(x=>typeof x==='string'&&x.length<=60))throw Error('Seguimiento de canción no válido');}}}
 if(value.instruments!==undefined){if(!Array.isArray(value.instruments)||!value.instruments.length||value.instruments.length>40||new Set(value.instruments.map((x:any)=>x.id)).size!==value.instruments.length)throw Error('Inventario no válido');for(const x of value.instruments)if(!id(x.id)||typeof x.name!=='string'||!x.name.trim()||x.name.length>100||!['barroca','alemana','yrf21'].includes(x.system)||typeof x.notes!=='string'||x.notes.length>2000)throw Error('Ficha de instrumento no válida');}
 if(value.learners&&value.instruments&&value.learners.some((x:any)=>!value.instruments.some((i:any)=>i.id===x.instrumentId)))throw Error('Instrumento del perfil no encontrado');
}

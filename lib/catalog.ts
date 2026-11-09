import {practiceStatus} from './practice-status.ts';
import {REVIEWED_EXERCISES} from './reviewed-music.ts';
export type Note={id:string,name:string,midi:number,holes:number[],register:string;halfHoles?:number[];baroqueOnly?:boolean};
export const NOTES:Note[]=[
{id:'C5',name:'DO',midi:72,holes:[0,1,2,3,4,5,6,7],register:'grave'},
{id:'D5',name:'RE',midi:74,holes:[0,1,2,3,4,5,6],register:'grave'},
{id:'E5',name:'MI',midi:76,holes:[0,1,2,3,4,5],register:'grave'},
{id:'F5',name:'FA',midi:77,holes:[0,1,2,3,4],register:'grave'},
{id:'G5',name:'SOL',midi:79,holes:[0,1,2,3],register:'medio'},
{id:'A5',name:'LA',midi:81,holes:[0,1,2],register:'medio'},
{id:'B5',name:'SI',midi:83,holes:[0,1],register:'medio'},
{id:'C6',name:'DO',midi:84,holes:[0,2],register:'agudo'},
{id:'D6',name:'RE',midi:86,holes:[2],register:'agudo'},
{id:'F#5',name:'FA♯',midi:78,holes:[0,1,2,3,5,6,7],register:'grave',},
{id:'Bb5',name:'SI♭',midi:82,holes:[0,1,3,4],register:'medio',},
{id:'E6',name:'MI',midi:88,holes:[1,2,3,4,5],halfHoles:[0],register:'agudo',},
{id:'F6',name:'FA',midi:89,holes:[1,2,3,4],halfHoles:[0],register:'agudo',},
{id:'G6',name:'SOL',midi:91,holes:[1,2,3],halfHoles:[0],register:'agudo',},
{id:'A6',name:'LA',midi:93,holes:[1,2],halfHoles:[0],register:'agudo',}];
export const note=(id:string)=>NOTES.find(n=>n.id===id)!;
export type Event={n:string|null,b:number};
export type Exercise={id:string,title:string,subtitle:string,phase:number,level:string,bpm:number,events:Event[],tip:string,error:string,source:string;beatsPerBar?:2|3|4;baroqueOnly?:boolean};
// German soprano positions: Yamaha German chart, visually checked 2026-11-05.
// 0 is the rear thumb. Half closure vents the thumb for the upper register.
export const GERMAN_FINGERINGS:Record<string,{holes:number[];halfHoles?:number[]}>= {
 F5:{holes:[0,1,2,3,4]},
 'F#5':{holes:[0,1,2,3,5,6,7]},
 Bb5:{holes:[0,1,3,4]},
 E6:{holes:[1,2,3,4,5],halfHoles:[0]},
 F6:{holes:[1,2,3,4],halfHoles:[0]},
 G6:{holes:[1,2,3],halfHoles:[0]},
 A6:{holes:[1,2],halfHoles:[0]}
};
export function fingeringFor(id:string,system='alemana'){
 const n=NOTES.find(n=>n.id===id);
 if(!n||!['barroca','alemana'].includes(system))return null;
 const legacy:Record<string,number[]>={F5:[0,1,2,3,4,6,7],'F#5':[0,1,2,3,5,6],F6:[1,2,3,4,6]};
 return system==='alemana'?{...n,...GERMAN_FINGERINGS[id]}:{...n,holes:legacy[id]||n.holes};
}
export function supportsExercise(e:Exercise,system='alemana'){
 return e.events.every(ev=>!ev.n||fingeringFor(ev.n,system)!==null);
}
const seq=(ids:string[],beats=1):Event[]=>ids.map(n=>({n:n==='S'?null:n,b:beats}));
export const EXERCISES:Exercise[]=[
{id:'primer-si',title:'Mi primer sonido',subtitle:'Una nota, un soplo tranquilo',phase:1,level:'Principiante',bpm:60,events:seq(['B5','S','B5','S'],2),tip:'Di «tu» suavemente al iniciar cada SI. Tapa el agujero trasero con el pulgar izquierdo y el primero con el índice.',error:'Soplar demasiado o dejar una pequeña rendija bajo el pulgar.',source:'Ejercicio original · Flauta PRO'},
{id:'si-la',title:'Dos dedos en conversación',subtitle:'El cambio SI–LA',phase:1,level:'Principiante',bpm:60,events:seq(['B5','A5','B5','A5','B5','A5','B5','S']),tip:'Mantén el índice y el pulgar apoyados. Solo se mueve el dedo corazón izquierdo.',error:'Levantar todos los dedos entre las notas.',source:'Ejercicio original · Flauta PRO'},
{id:'tres-notas',title:'Tres notas, una melodía',subtitle:'SI, LA y SOL',phase:1,level:'Principiante',bpm:64,events:seq(['B5','A5','G5','A5','B5','B5','A5','G5']),tip:'Escucha primero. Practica cuatro notas y luego las otras cuatro.',error:'Acercar los dedos con tensión; mantenlos próximos a los agujeros.',source:'Melodía original · Flauta PRO'},
{id:'eco',title:'El juego del eco',subtitle:'Repite y deja espacio',phase:1,level:'Principiante',bpm:64,events:seq(['G5','A5','B5','S','B5','A5','G5','S']),tip:'La tarjeta «Silencio» significa que dejas de soplar durante un pulso.',error:'Tocar durante el silencio o adelantarse después.',source:'Melodía original · Flauta PRO'},
{id:'do-agudo',title:'Una ventana al DO',subtitle:'SI–DO agudo',phase:2,level:'Principiante',bpm:60,events:seq(['B5','C6','B5','A5','B5','C6','B5','S']),tip:'En DO agudo, tapa el agujero trasero y el segundo delantero. El primero queda abierto.',error:'Confundir DO agudo con DO grave: tienen digitaciones distintas.',source:'Ejercicio original · Flauta PRO'},
{id:'re-agudo',title:'Llegamos al RE agudo',subtitle:'Un nuevo sonido',phase:2,level:'Principiante',bpm:60,events:seq(['C6','D6','C6','B5','A5','B5','C6','D6']),tip:'RE agudo: deja solo el segundo agujero delantero tapado; el pulgar trasero se abre.',error:'Dejar el pulgar tapado al pasar de DO a RE agudo.',source:'Ejercicio original · Flauta PRO'},
{id:'mano-derecha',title:'Despertar la mano derecha',subtitle:'SOL–MI–RE–DO graves',phase:3,level:'Principiante',bpm:56,events:seq(['G5','E5','D5','C5','C5','D5','E5','G5']),tip:'Coloca la mano derecha debajo de la izquierda. Las notas graves necesitan un soplo especialmente suave.',error:'Apretar demasiado o soplar como en las notas agudas.',source:'Ejercicio original · Flauta PRO'},
{id:'fa',title:'El puente del FA',subtitle:'MI–FA–SOL · digitación alemana',phase:3,level:'Principiante',bpm:56,events:seq(['E5','F5','G5','F5','E5','F5','E5','S']),tip:'FA alemán: tapa el pulgar y los agujeros 1–4; deja abiertos 5–7. Observa el dibujo antes de tocar.',error:'Usar una posición barroca en tu flauta alemana.',source:'Ejercicio original · Flauta PRO'},
{id:'escala',title:'Subir y bajar la escalera',subtitle:'La escala de DO',phase:4,level:'Intermedio',bpm:60,events:seq(['C5','D5','E5','F5','G5','A5','B5','C6','C6','B5','A5','G5','F5','E5','D5','C5']),tip:'Toca primero solo la subida. Cada grupo de cuatro tarjetas forma un compás de cuatro pulsos.',error:'Acelerar al bajar o perder el cierre de los agujeros inferiores.',source:'Escala de DO mayor · Flauta PRO'},
{id:'cordero',title:'María tenía un corderito',subtitle:'Melodía tradicional · versión didáctica',phase:3,level:'Principiante',bpm:76,events:[...seq(['E5','D5','C5','D5']),...seq(['E5','E5']),{n:'E5',b:2},...seq(['D5','D5']),{n:'D5',b:2},{n:'E5',b:1},{n:'G5',b:1},{n:'G5',b:2},...seq(['E5','D5','C5','D5','E5','E5','E5','E5','D5','D5','E5','D5']),{n:'C5',b:4}],tip:'Empieza por los dos primeros compases. Respira después de las notas largas.',error:'Dar la misma duración a todas las notas: mira los pulsos bajo cada tarjeta.',source:'Melodía tradicional de dominio público · arreglo didáctico propio, no transcripción del PDF'},
{id:'pregunta',title:'Pregunta y respuesta',subtitle:'Crea una pequeña historia',phase:5,level:'Intermedio',bpm:72,events:seq(['G5','A5','B5','C6','B5','A5','G5','S','E5','F5','G5','A5','G5','E5','C5','S']),tip:'Haz una pequeña respiración en cada silencio y escucha cómo termina cada frase.',error:'Quedarse sin aire por no respetar los espacios entre frases.',source:'Melodía original · Flauta PRO'}];
EXERCISES.push(
{id:'arpegio-do',title:'Arpegio de DO',subtitle:'DO–MI–SOL–DO: notas de un acorde',phase:4,level:'Intermedio',bpm:56,events:seq(['C5','E5','G5','C6','C6','G5','E5','C5']),tip:'Une las notas despacio; respira al terminar los cuatro pulsos.',error:'Mover los dedos demasiado lejos de los agujeros.',source:'Estudio original · Flauta PRO'},
{id:'legato',title:'Un solo hilo de aire',subtitle:'Legato: liga dos notas y respira',phase:2,level:'Básico',bpm:60,events:seq(['G5','A5','B5','S','B5','A5','G5','S']),tip:'Ataca la primera nota con «du» y cambia los dedos sin cortar el aire entre las notas ligadas.',error:'Confundir ligar con soplar más fuerte.',source:'Estudio original · Flauta PRO'},
{id:'staccato',title:'Notas cortas y claras',subtitle:'Staccato suave sin endurecer la lengua',phase:3,level:'Básico',bpm:60,events:seq(['E5','G5','E5','S','D5','G5','D5','S']),tip:'Di «tu» con suavidad y acorta el sonido sin adelantar la siguiente nota.',error:'Acelerar porque los sonidos son cortos.',source:'Estudio original · Flauta PRO'},
{id:'arpegio-sol',title:'Arpegio de SOL',subtitle:'SOL–SI–RE agudo',phase:5,level:'Intermedio',bpm:64,events:seq(['G5','B5','D6','B5','G5','B5','D6','S']),tip:'En RE agudo abre el pulgar; en SI vuelve a cerrarlo. Mantén el segundo agujero tapado.',error:'Dejar el pulgar cerrado en RE agudo.',source:'Estudio original · Flauta PRO'},
{id:'corcheas',title:'Dos notas por pulso',subtitle:'Corcheas y negras sin perder el pulso',phase:4,level:'Intermedio',bpm:54,events:[...seq(['G5','A5','B5','A5'],.5),{n:'G5',b:1},{n:null,b:1},...seq(['A5','B5','C6','B5'],.5),{n:'A5',b:1},{n:null,b:1}],tip:'Cuenta «uno y, dos y» en las corcheas. Cada pareja dura un pulso.',error:'Dar un pulso entero a cada corchea.',source:'Estudio original · Flauta PRO'});
EXERCISES.push(
{id:'ventana-agudos',title:'Ventilar el pulgar',subtitle:'RE–MI–FA–SOL agudos · soprano alemana',phase:5,level:'Intermedio-alto',bpm:52,events:seq(['D6','E6','F6','G6','G6','F6','E6','D6']),tip:'En RE el pulgar está abierto. En MI, FA y SOL se semicierra: deja una pequeña abertura y aumenta el aire gradualmente.',error:'Cerrar completamente el pulgar o forzar el aire para obtener el registro superior.',source:'Estudio original; digitaciones contrastadas con Yamaha · soprano alemana'},
{id:'alteraciones',title:'Dos colores nuevos',subtitle:'FA sostenido y SI bemol · soprano alemana',phase:5,level:'Intermedio-alto',bpm:52,events:seq(['E5','F#5','G5','S','A5','Bb5','C6','S']),tip:'FA♯ y SI♭ usan digitaciones cruzadas. Mira el dibujo, escucha y comprueba que el sonido sea estable.',error:'Confundir FA natural con FA sostenido: en FA sostenido se abren el 4 y se cierran 5, 6 y 7.',source:'Estudio original; digitaciones contrastadas con Yamaha · soprano alemana'});
EXERCISES.push(...REVIEWED_EXERCISES);
// Orden estable por fase: conserva IDs e historial y evita saltar a repertorio avanzado.
EXERCISES.sort((a,b)=>a.phase-b.phase);
export const PHASES=[{title:'SI · LA · SOL',text:'Tus primeros sonidos y melodías de tres notas.'},{title:'DO y RE agudos',text:'Ampliamos las notas sin confundir los registros.'},{title:'La mano derecha',text:'DO, RE y MI graves. Después, FA y sus cambios.'},{title:'La escala completa',text:'Conecta las notas y empieza a leer duraciones.'},{title:'Canciones y expresión',text:'Frases, respiraciones y pequeñas melodías completas.'},{title:'Seguir creciendo',text:'Alteraciones y registro superior. Consulta las alteraciones y los agudos en Notas y digitaciones; practica los estudios de soprano alemana de la fase 5.'}];
export function recommend(attempts:any[],system='alemana'){let target=EXERCISES[0];for(const e of EXERCISES.filter(e=>e.id!=='cordero'&&supportsExercise(e,system))){target=e;const status=practiceStatus(attempts,e.id);if(!status.passed)return {exercise:e,reason:status.validAttempts?'Repaso sugerido: aún no constan tres prácticas completas y fiables al 85 % en modo «A mi ritmo», repartidas en dos días. Puedes avanzar con «Avanzar al siguiente ejercicio».':'Este es el siguiente paso del recorrido. Primero escuchamos y aprendemos las digitaciones.'};}return {exercise:target,reason:'Ya has recorrido el contenido inicial. Repasa una melodía y prueba una variante rítmica.'}}
export function totals(exercise:Exercise){return exercise.events.reduce((s,e)=>s+e.b,0)}
// Tonalidades cotejadas con las fuentes de las adaptaciones; no inferir la
// armadura del resto del material histórico que aún está sin certificar.
const VERIFIED_KEY_FIFTHS:Record<string,number>={
 'dulce-navidad-revisada':-1,'campana-revisada':-1,'campanero-revisado':-1,
 'fum-revisada':-2,'peces-completa-revisada':-2,'peces-estribillo-revisado':-2,
 'adeste-revisada':1,'cumpleanos-revisada':1
};
export function musicXml(e:Exercise){const beats=e.beatsPerBar??4,divisions=e.events.some(ev=>!Number.isInteger(ev.b*2))?4:2,fifths=VERIFIED_KEY_FIFTHS[e.id]??0;let time=0,bar=1,measures='',body='';for(const ev of e.events){if(time===0)body=`<measure number="${bar}">${bar===1?`<attributes><divisions>${divisions}</divisions><key><fifths>${fifths}</fifths></key><time><beats>${beats}</beats><beat-type>4</beat-type></time><clef><sign>G</sign><line>2</line></clef><transpose><diatonic>0</diatonic><chromatic>0</chromatic><octave-change>1</octave-change></transpose></attributes><direction><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${e.bpm}</per-minute></metronome></direction-type><sound tempo="${e.bpm}"/></direction>`:''}`;const n=ev.n?note(ev.n):null;body+=`<note>${n?`<pitch><step>${n.id[0]}</step>${n.id.includes('#')?'<alter>1</alter>':n.id.includes('b')?'<alter>-1</alter>':''}<octave>${Number(n.id.match(/\d+/)?.[0])-1}</octave></pitch>`:'<rest/>'}<duration>${ev.b*divisions}</duration><type>${ev.b===4?'whole':(ev.b===2||ev.b===3)?'half':ev.b===.25?'16th':(ev.b===.5||ev.b===.75)?'eighth':'quarter'}</type>${(ev.b===.75||ev.b===1.5||ev.b===3)?'<dot/>':''}${n?`<lyric><text>${n.name}${n.register==='agudo'?' ↑':''}</text></lyric>`:''}</note>`;time+=ev.b;if(time===beats){measures+=body+'</measure>';time=0;bar++}}if(time)measures+=body+'</measure>';return `<?xml version="1.0" encoding="utf-8"?><score-partwise version="4.0"><work><work-title>${e.title}</work-title></work><part-list><score-part id="P1"><part-name>Flauta soprano · suena una octava por encima</part-name></score-part></part-list><part id="P1">${measures}</part></score-partwise>`}

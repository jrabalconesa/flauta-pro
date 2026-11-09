import type {Exercise,Event} from './catalog.ts';
import {BEGINNER_REVIEWED_EXERCISES} from './beginner-reviewed-music.ts';

// Compases 1–16 de la referencia Voz/Flauta. Alturas sonoras de soprano.
// Se conserva aparte el comienzo de cuatro compases para mantener su historial.
const bar=(...events:[string|null,number][]):Event[]=>events.map(([n,b])=>({n,b}));
export const RODOLFO_SECTION_BARS:Event[][]=[
 bar(['G5',.5],['A5',1],['G5',.5],['E5',1],['C6',1]),
 bar(['A5',1],['G5',2],[null,1]),
 bar(['G5',.5],['A5',.5],['G5',.5],['A5',.5],['G5',1],['C6',1]),
 bar(['B5',3],[null,1]),
 bar(['F5',.5],['G5',1],['F5',.5],['D5',1],['B5',1]),
 bar(['A5',1],['G5',2],[null,1]),
 bar(['G5',.5],['A5',.5],['G5',.5],['A5',.5],['G5',1],['A5',1]),
 bar(['E5',3],[null,1]),
 bar(['G5',.5],['A5',1],['G5',.5],['E5',1],['C6',1]),
 bar(['A5',1],['G5',2],[null,1]),
 bar(['G5',.5],['A5',.5],['G5',.5],['A5',.5],['G5',1],['C6',1]),
 bar(['B5',3],[null,1]),
 bar(['F5',.5],['G5',1],['F5',.5],['D5',1],['B5',1]),
 bar(['A5',1],['G5',2],[null,1]),
 bar(['G5',.5],['A5',.5],['G5',.5],['A5',.5],['G5',1],['C6',1]),
 bar(['B5',3],[null,1]),
];

// Puente (17–24) y cierre (25–33): adaptación monofónica sin repetición.
// En 32–33 se conserva solo la nota superior de los acordes de la referencia.
export const RODOLFO_BRIDGE_BARS:Event[][]=[
 bar(['G5',1],['B5',1],['A5',1],['G5',1]),
 bar(['F5',1],['E5',.5],['F5',1.5],[null,1]),
 bar(['F5',1],['A5',1],['G5',1],['F5',1]),
 bar(['E5',3],[null,1]),
 bar(['D5',1],['E5',1],['F#5',1],['D5',1]),
 bar(['G5',1],['G5',.5],['G5',1.5],[null,1]),
 bar(['C6',1],['C6',1],['B5',1],['A5',1]),
 bar(['G5',1],['F5',.5],['E5',1.5],[null,1]),
];
export const RODOLFO_ENDING_BARS:Event[][]=[
 ...RODOLFO_SECTION_BARS.slice(0,7),
 // Sustituimos 29–31 por su continuación real; no repetimos literalmente 1–8.
];
RODOLFO_ENDING_BARS.splice(4,3,
 bar(['F5',.5],['G5',1],['F5',.5],['D5',1],['B5',1]),
 bar(['A5',1],['G5',2],[null,1]),
 bar(['G5',.5],['A5',.5],['G5',.5],['A5',.5],['G5',1],['D6',1]),
 bar(['C6',2],['B5',1],[null,1]),
 bar(['C6',1],[null,1],[null,2])
);
export const RODOLFO_COMPLETE_BARS=[...RODOLFO_SECTION_BARS,...RODOLFO_BRIDGE_BARS,...RODOLFO_ENDING_BARS];
const rodolfoSource='Pieza 87 del cancionero aportado, página PDF 32; ritmo y alturas contrastados visualmente con la referencia Voz/Flauta de Jorge Benayas y Ester López (Listen, Play, Create). Adaptación monofónica propia: sin la repetición indicada al final del compás 24, nota superior de los acordes de 32–33 y articulación normalizada. No es una transcripción literal de todos los signos de esa edición. Soprano: sonido una octava por encima de la escritura. Tempo de estudio propio.';

export const CAMPANERO_BARS:Event[][]=[
 bar(['F5',1],['G5',1],['A5',1],['F5',1]),bar(['F5',1],['G5',1],['A5',1],['F5',1]),
 bar(['A5',1],['Bb5',1],['C6',2]),bar(['A5',1],['Bb5',1],['C6',2]),
 bar(['C6',.5],['D6',.5],['C6',.5],['Bb5',.5],['A5',1],['F5',1]),
 bar(['C6',.5],['D6',.5],['C6',.5],['Bb5',.5],['A5',1],['F5',1]),
 bar(['F5',1],['C5',1],['F5',2]),bar(['F5',1],['C5',1],['F5',2]),
];
// Adaptación de la voz soprano de Mutopia 1295. SI bemol -> DO mayor,
// duraciones duplicadas y cada 6/8 dividido en dos compases 3/4.
// El cierre reserva los tres últimos pulsos para respirar.
export const NOCHE_PAZ_BARS:Event[][]=[
 bar(['G5',1.5],['A5',.5],['G5',1]),bar(['E5',3]),
 bar(['G5',1.5],['A5',.5],['G5',1]),bar(['E5',3]),
 bar(['D6',2],['D6',1]),bar(['B5',3]),bar(['C6',2],['C6',1]),bar(['G5',3]),
 bar(['A5',2],['A5',1]),bar(['C6',1.5],['B5',.5],['A5',1]),
 bar(['G5',1.5],['A5',.5],['G5',1]),bar(['E5',3]),
 bar(['A5',2],['A5',1]),bar(['C6',1.5],['B5',.5],['A5',1]),
 bar(['G5',1.5],['A5',.5],['G5',1]),bar(['E5',3]),
 bar(['D6',2],['D6',1]),bar(['F6',1.5],['D6',.5],['B5',1]),
 bar(['C6',3]),bar(['E6',3]),
 bar(['C6',1.5],['G5',.5],['E5',1]),bar(['G5',1.5],['F5',.5],['D5',1]),
 bar(['C5',3]),bar([null,3]),
];

export const ADESTE_BARS:Event[][]=[[{"n":null,"b":3},{"n":"G5","b":1}],[{"n":"G5","b":2},{"n":"D5","b":1},{"n":"G5","b":1}],[{"n":"A5","b":1},{"n":"F#5","b":1},{"n":"D5","b":2}],[{"n":"B5","b":1},{"n":"A5","b":1},{"n":"B5","b":1},{"n":"C6","b":1}],[{"n":"B5","b":2},{"n":"A5","b":1},{"n":"G5","b":1}],[{"n":"G5","b":2},{"n":"F#5","b":1},{"n":"E5","b":1}],[{"n":"F#5","b":1},{"n":"G5","b":1},{"n":"A5","b":1},{"n":"B5","b":0.5},{"n":"G5","b":0.5}],[{"n":"F#5","b":2},{"n":"E5","b":1.5},{"n":"D5","b":0.5}],[{"n":"D5","b":3},{"n":null,"b":1}],[{"n":"D6","b":2},{"n":"C6","b":1},{"n":"B5","b":1}],[{"n":"C6","b":2},{"n":"B5","b":2}],[{"n":"A5","b":1},{"n":"B5","b":1},{"n":"G5","b":1},{"n":"A5","b":1}],[{"n":"F#5","b":1},{"n":"E5","b":1},{"n":"D5","b":1},{"n":"G5","b":1}],[{"n":"G5","b":1},{"n":"F#5","b":1},{"n":"G5","b":1},{"n":"A5","b":1}],[{"n":"G5","b":2},{"n":"D5","b":1},{"n":"B5","b":1}],[{"n":"B5","b":1},{"n":"A5","b":1},{"n":"B5","b":1},{"n":"C6","b":1}],[{"n":"B5","b":2},{"n":"A5","b":1},{"n":"B5","b":1}],[{"n":"C6","b":1},{"n":"B5","b":1},{"n":"A5","b":1},{"n":"G5","b":1}],[{"n":"F#5","b":2},{"n":"G5","b":1},{"n":"C6","b":1}],[{"n":"B5","b":2},{"n":"A5","b":1.5},{"n":"G5","b":0.5}],[{"n":"G5","b":3.0},{"n":null,"b":1}]];
export const CUMPLE_BARS:Event[][]=[[{"n":null,"b":2},{"n":"D5","b":0.5},{"n":"D5","b":0.5}],[{"n":"E5","b":1},{"n":"D5","b":1},{"n":"G5","b":1}],[{"n":"F#5","b":2},{"n":"D5","b":0.5},{"n":"D5","b":0.5}],[{"n":"E5","b":1},{"n":"D5","b":1},{"n":"A5","b":1}],[{"n":"G5","b":2},{"n":"D5","b":0.5},{"n":"D5","b":0.5}],[{"n":"D6","b":1},{"n":"B5","b":1},{"n":"G5","b":1}],[{"n":"F#5","b":1},{"n":"E5","b":1},{"n":"C6","b":0.5},{"n":"C6","b":0.5}],[{"n":"B5","b":1},{"n":"G5","b":1},{"n":"A5","b":1}],[{"n":"G5","b":2},{"n":null,"b":1}]];
export const PECES_REFRAIN_BARS:Event[][]=[[{"n":"Bb5","b":1},{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.5},{"n":"Bb5","b":1},{"n":"A5","b":0.5},{"n":"G5","b":0.5}],[{"n":"A5","b":1.5},{"n":"F#5","b":0.5},{"n":"D5","b":1},{"n":null,"b":1}],[{"n":"C6","b":1},{"n":"C6","b":0.5},{"n":"C6","b":0.5},{"n":"C6","b":1},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5}],[{"n":"Bb5","b":1.5},{"n":"A5","b":0.5},{"n":"G5","b":1},{"n":null,"b":1}],[{"n":"Bb5","b":1},{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.5},{"n":"Bb5","b":1},{"n":"A5","b":0.5},{"n":"G5","b":0.5}],[{"n":"A5","b":1.5},{"n":"F#5","b":0.5},{"n":"D5","b":1},{"n":null,"b":1}],[{"n":"C6","b":1},{"n":"C6","b":0.5},{"n":"C6","b":0.5},{"n":"C6","b":1},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5}],[{"n":"Bb5","b":1.5},{"n":"A5","b":0.5},{"n":"G5","b":1},{"n":null,"b":0.5},{"n":null,"b":0.5}]];

export const CAMPANA_BARS:Event[][]=[
 [{"n":"F5","b":1},{"n":"F5","b":0.5},{"n":"F5","b":0.5}],
 [{"n":"F5","b":1},{"n":"E5","b":0.5},{"n":"F5","b":0.5}],
 [{"n":"G5","b":1.5},{"n":"E5","b":0.5}],
 [{"n":"C5","b":2}],
 [{"n":"G5","b":1},{"n":"G5","b":0.5},{"n":"A5","b":0.5}],
 [{"n":"Bb5","b":1},{"n":"A5","b":0.5},{"n":"G5","b":0.5}],
 [{"n":"A5","b":1.5},{"n":"G5","b":0.5}],
 [{"n":"F5","b":2}],
 [{"n":"F5","b":1},{"n":"F5","b":0.5},{"n":"F5","b":0.5}],
 [{"n":"F5","b":1},{"n":"E5","b":0.5},{"n":"F5","b":0.5}],
 [{"n":"G5","b":1.5},{"n":"E5","b":0.5}],
 [{"n":"C5","b":2}],
 [{"n":"G5","b":1},{"n":"G5","b":0.5},{"n":"A5","b":0.5}],
 [{"n":"Bb5","b":1},{"n":"A5","b":0.5},{"n":"G5","b":0.5}],
 [{"n":"A5","b":1.5},{"n":"G5","b":0.5}],
 [{"n":"F5","b":1.5},{"n":"A5","b":0.5}],
 [{"n":"C6","b":1},{"n":null,"b":0.5},{"n":"C6","b":0.5}],
 [{"n":"D6","b":0.5},{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"D6","b":0.5}],
 [{"n":"C6","b":1},{"n":null,"b":0.5},{"n":"C6","b":0.5}],
 [{"n":"D6","b":0.5},{"n":"C6","b":0.5},{"n":"D6","b":0.5},{"n":"E6","b":0.5}],
 [{"n":"F6","b":1},{"n":"A5","b":0.5},{"n":"D6","b":0.5}],
 [{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5},{"n":"G5","b":0.5}],
 [{"n":"F5","b":1},{"n":null,"b":1}],
 [{"n":"A5","b":1.5},{"n":"Bb5","b":0.5}],
 [{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"F5","b":1}],
 [{"n":"C6","b":1.5},{"n":"D6","b":0.5}],
 [{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":1}],
 [{"n":"C6","b":1.5},{"n":"C6","b":0.5}],
 [{"n":"B5","b":1.5},{"n":"G5","b":0.5}],
 [{"n":"C6","b":1.5},{"n":"Bb5","b":0.5}],
 [{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"F5","b":1}],
 [{"n":"A5","b":1.5},{"n":"Bb5","b":0.5}],
 [{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"F5","b":1}],
 [{"n":"C6","b":1.5},{"n":"D6","b":0.5}],
 [{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":1}],
 [{"n":"C6","b":1.5},{"n":"C6","b":0.5}],
 [{"n":"B5","b":1.5},{"n":"G5","b":0.5}],
 [{"n":"C6","b":1.5},{"n":"Bb5","b":0.5}],
 [{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"F5","b":0.5},{"n":"A5","b":0.5}],
 [{"n":"C6","b":1},{"n":null,"b":0.5},{"n":"C6","b":0.5}],
 [{"n":"D6","b":0.5},{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"D6","b":0.5}],
 [{"n":"C6","b":1},{"n":null,"b":0.5},{"n":"C6","b":0.5}],
 [{"n":"D6","b":0.5},{"n":"C6","b":0.5},{"n":"D6","b":0.5},{"n":"E6","b":0.5}],
 [{"n":"F6","b":1},{"n":"A5","b":0.5},{"n":"D6","b":0.5}],
 [{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5},{"n":"G5","b":0.5}],
 [{"n":"F5","b":2}]
];
export const PECES_COMPLETE_BARS:Event[][]=[
 [{"n":null,"b":3},{"n":null,"b":0.5},{"n":"G5","b":0.25},{"n":"A5","b":0.25}],
 [{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5},{"n":"Bb5","b":1},{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.5}],
 [{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":null,"b":0.5},{"n":"A5","b":0.25},{"n":"Bb5","b":0.25}],
 [{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":1},{"n":"A5","b":0.5},{"n":"G5","b":0.5}],
 [{"n":"F#5","b":0.5},{"n":"G5","b":0.5},{"n":"A5","b":0.5},{"n":"Bb5","b":0.5},{"n":"G5","b":1},{"n":null,"b":1}],
 [{"n":"Bb5","b":1},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5},{"n":"Bb5","b":1},{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.5}],
 [{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":1},{"n":null,"b":0.5},{"n":"A5","b":0.25},{"n":"Bb5","b":0.25}],
 [{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":1},{"n":"A5","b":0.5},{"n":"G5","b":0.5}],
 [{"n":"F#5","b":0.5},{"n":"G5","b":0.5},{"n":"A5","b":0.5},{"n":"Bb5","b":0.5},{"n":"G5","b":1},{"n":null,"b":1}],
 [{"n":"Bb5","b":1},{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.5},{"n":"Bb5","b":1},{"n":"A5","b":0.5},{"n":"G5","b":0.5}],
 [{"n":"A5","b":1.5},{"n":"F#5","b":0.5},{"n":"D5","b":1},{"n":null,"b":1}],
 [{"n":"C6","b":1},{"n":"C6","b":0.5},{"n":"C6","b":0.5},{"n":"C6","b":1},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5}],
 [{"n":"Bb5","b":1.5},{"n":"A5","b":0.5},{"n":"G5","b":1},{"n":null,"b":1}],
 [{"n":"Bb5","b":1},{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.5},{"n":"Bb5","b":1},{"n":"A5","b":0.5},{"n":"G5","b":0.5}],
 [{"n":"A5","b":1.5},{"n":"F#5","b":0.5},{"n":"D5","b":1},{"n":null,"b":1}],
 [{"n":"C6","b":1},{"n":"C6","b":0.5},{"n":"C6","b":0.5},{"n":"C6","b":1},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5}],
 [{"n":"Bb5","b":1.5},{"n":"A5","b":0.5},{"n":"G5","b":1},{"n":null,"b":0.5},{"n":null,"b":0.5}]
];

export const JINGLE_BARS:Event[][]=[
 [{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":null,"b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":null,"b":0.5}],
 [{"n":"A5","b":0.5},{"n":"C6","b":0.5},{"n":"F5","b":0.75},{"n":"G5","b":0.25},{"n":"A5","b":1},{"n":null,"b":1}],
 [{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.75},{"n":"Bb5","b":0.25},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5}],
 [{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"G5","b":0.5},{"n":"A5","b":0.5},{"n":"G5","b":1},{"n":"C6","b":0.5},{"n":null,"b":0.5}],
 [{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":null,"b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":null,"b":0.5}],
 [{"n":"A5","b":0.5},{"n":"C6","b":0.5},{"n":"F5","b":0.75},{"n":"G5","b":0.25},{"n":"A5","b":1},{"n":null,"b":1}],
 [{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.5},{"n":"Bb5","b":0.75},{"n":"Bb5","b":0.25},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5},{"n":"A5","b":0.5}],
 [{"n":"C6","b":0.5},{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"G5","b":0.5},{"n":"F5","b":1},{"n":null,"b":1}],
 [{"n":"C5","b":0.5},{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"F5","b":0.5},{"n":"C5","b":1.5},{"n":null,"b":0.5}],
 [{"n":"C5","b":0.5},{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"F5","b":0.5},{"n":"D5","b":1.5},{"n":null,"b":0.5}],
 [{"n":"D5","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"C6","b":1},{"n":"C6","b":0.75},{"n":"C6","b":0.25}],
 [{"n":"D6","b":0.5},{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"G5","b":0.5},{"n":"A5","b":1},{"n":null,"b":1}],
 [{"n":"C5","b":0.5},{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"F5","b":0.5},{"n":"C5","b":1.5},{"n":null,"b":0.5}],
 [{"n":"C5","b":0.5},{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"F5","b":0.5},{"n":"D5","b":1.5},{"n":null,"b":0.5}],
 [{"n":"D5","b":0.5},{"n":"Bb5","b":0.5},{"n":"A5","b":0.5},{"n":"G5","b":0.5},{"n":"C6","b":1},{"n":"C6","b":0.75},{"n":"C6","b":0.25}],
 [{"n":"D6","b":0.5},{"n":"C6","b":0.5},{"n":"Bb5","b":0.5},{"n":"G5","b":0.5},{"n":"F5","b":1},{"n":null,"b":1}]
];
export const FUM_BARS:Event[][]=[
 [{"n":"G5","b":1.5},{"n":"G5","b":0.5}],
 [{"n":"G5","b":1},{"n":"Bb5","b":1}],
 [{"n":"A5","b":1},{"n":"G5","b":1}],
 [{"n":"F#5","b":1},{"n":"D5","b":1}],
 [{"n":"G5","b":1},{"n":null,"b":1}],
 [{"n":"F#5","b":1},{"n":null,"b":1}],
 [{"n":"G5","b":1},{"n":null,"b":1}],
 [{"n":null,"b":1},{"n":"F5","b":0.5},{"n":"F5","b":0.5}],
 [{"n":"Bb5","b":1},{"n":"Bb5","b":1}],
 [{"n":"A5","b":1},{"n":"A5","b":1}],
 [{"n":"Bb5","b":1},{"n":"Bb5","b":1}],
 [{"n":"A5","b":1},{"n":"A5","b":1}],
 [{"n":"Bb5","b":1},{"n":"Bb5","b":1}],
 [{"n":"A5","b":1},{"n":"A5","b":1}],
 [{"n":"Bb5","b":1},{"n":null,"b":1}],
 [{"n":null,"b":1},{"n":"A5","b":0.5},{"n":"Bb5","b":0.5}],
 [{"n":"C6","b":1.5},{"n":"Bb5","b":0.5}],
 [{"n":"A5","b":1},{"n":"G5","b":1}],
 [{"n":"F#5","b":1},{"n":"D5","b":1}],
 [{"n":"G5","b":1},{"n":"F#5","b":1}],
 [{"n":"G5","b":1},{"n":"Bb5","b":1}],
 [{"n":"A5","b":1},{"n":"G5","b":1}],
 [{"n":"F#5","b":1},{"n":"D5","b":1}],
 [{"n":"G5","b":1},{"n":null,"b":1}],
 [{"n":"F#5","b":1},{"n":null,"b":1}],
 [{"n":"G5","b":1},{"n":null,"b":1}],
 [{"n":null,"b":2}]
];

const phrase=(notes:string[])=>notes.map((n,i)=>({n,b:i===notes.length-1?2:1}));
export const REVIEWED_EXERCISES:Exercise[]=[
 ...BEGINNER_REVIEWED_EXERCISES,
{"id":"dulce-navidad-revisada","title":"Dulce Navidad · Jingle Bells revisada","subtitle":"16 compases en 4/4 · FA mayor · corchea con puntillo","phase":5,"level":"Intermedio","bpm":64,"events":JINGLE_BARS.flat(),"tip":"Escucha al 60 %. La corchea con puntillo dura tres cuartos de pulso y la semicorchea siguiente un cuarto: juntas completan un pulso. Prepara SI bemol y distingue DO grave de DO agudo.","error":"Dar la misma duración a las dos notas del ritmo con puntillo o tocar SI natural en lugar de SI bemol.","source":"Jingle Bells / Navidad, Navidad, de James Lord Pierpont; alternativa de estudio para la pieza 28 Dulce Navidad del cancionero. Fuente: Música Secundaria, Jingle Bells.pdf y Jingle Bells.mscz, voz Flauta I-Xilófono, 16 compases en FA mayor y 4/4. Se conservan notas, silencios y duraciones de esa voz, en el orden de la referencia (estribillo seguido de estrofa). Articulación normalizada y tempo de estudio propio. Alturas sonoras de soprano; no se valida el audio histórico ni se afirma transcripción literal de las notas abreviadas del cancionero."},
{"id":"fum-revisada","title":"Veinticinco de diciembre · Fum, fum, fum revisada","subtitle":"27 compases en 2/4 · SOL menor · sin repeticiones","phase":5,"level":"Intermedio","beatsPerBar":2,"bpm":72,"events":FUM_BARS.flat(),"tip":"Cuenta uno, dos y respira en los silencios. Prepara SI bemol y FA sostenido; FA natural también aparece en la entrada de la segunda sección. La primera nota con puntillo dura un pulso y medio.","error":"Mantener FA sostenido al llegar a los FA naturales de la segunda sección o repetir las partes que esta adaptación presenta una sola vez.","source":"Villancico tradicional Fum, fum, fum / Veinticinco de diciembre, pieza 108 del cancionero. Fuente: Música Secundaria, Fun Fun Fun.pdf y Fun Fun Fun.mscz, primera voz Flauta I-Xilófono, SOL menor y 2/4. Adaptación monofónica de estudio sin repeticiones ni D.C.: compases fuente 1–7 y 9–28. Se omite la primera casilla (compás 8, silencio), se utiliza la segunda casilla (9) para pasar a la segunda sección y se mantiene el silencio de cierre (28). Alturas sonoras de soprano y tempo propio. El audio histórico sigue sin validar."},
{"id":"campana-revisada","title":"Campana sobre campana · adaptación revisada","subtitle":"46 compases en 2/4 · repeticiones desarrolladas · soprano alemana","phase":5,"level":"Intermedio-alto","beatsPerBar":2,"bpm":72,"events":CAMPANA_BARS.flat(),"tip":"Cuenta uno, dos. Trabaja primero la estrofa y después el estribillo agudo. Prepara SI bemol y el MI y FA agudos con el pulgar semicerrado. Las vueltas ya están escritas: sigue las tarjetas sin saltar.","error":"Contar cuatro pulsos, repetir otra vez las secciones ya desarrolladas o tocar SI bemol en el compás que indica SI natural.","source":"Campana sobre campana, pieza 9 del cancionero. Fuente: Música Secundaria, Campana.pdf y campana.mscz, primera voz Flauta I-Xilófono, FA mayor y 2/4. Adaptación de estudio monofónica: se omiten dos compases de introducción de acompañamiento; se desarrollan las dos repeticiones respetando primera y segunda casilla (compases fuente 10/11 y 26/27). Se omite el D.C. final. 46 compases, alturas sonoras de soprano y tempo propio. No se valida el audio histórico."},
{"id":"peces-completa-revisada","title":"Los peces en el río · estrofa y estribillo revisados","subtitle":"17 compases en 4/4 · SOL menor · semicorcheas","phase":5,"level":"Intermedio","bpm":72,"events":PECES_COMPLETE_BARS.flat(),"tip":"Escucha al 60 %. Entra después de tres pulsos y medio de silencio: SOL y LA duran un cuarto de pulso cada uno. Cuatro semicorcheas caben en un pulso. Prepara SI bemol y FA sostenido.","error":"Tocar las semicorcheas como corcheas, entrar demasiado pronto o confundir esta adaptación en SOL menor con el audio antiguo.","source":"Los peces en el río, pieza 62 del cancionero. Fuente: Música Secundaria, Los peces.pdf y Los peces.mscz, primera voz Flauta-Xilófono, compases 1–17 en SOL menor. Adaptación monofónica de una estrofa y un estribillo, sin repeticiones. Se normaliza la preparación inicial a tres pulsos y medio de silencio antes de SOL–LA en semicorcheas. Al final se sustituyen las dos semicorcheas de entrada a una nueva estrofa por medio pulso de silencio. Se conservan las semicorcheas internas y el resto de las notas y duraciones. Alturas sonoras de soprano y tempo de estudio propio. El audio histórico sigue sin validar."},
{"id":"adeste-revisada","title":"Adeste fideles · adaptación de estudio","subtitle":"21 compases en 4/4 · SOL mayor · sin repeticiones","phase":5,"level":"Intermedio","bpm":72,"events":ADESTE_BARS.flat(),"tip":"Cuenta tres pulsos de silencio antes del SOL inicial. Prepara FA sostenido y mantén el RE de tres pulsos sin volver a soplar. Estudia de dos en dos compases.","error":"Rearticular las notas que estaban ligadas o tocar FA natural donde aparece FA sostenido.","source":"Adeste fideles, pieza 1 del cancionero. Fuente: Música Secundaria, partitura PDF y archivo MuseScore Adeste fideles, voz Flauta 1 en SOL mayor. Adaptación monofónica propia, una sola pasada sin la repetición de la segunda sección. Se añaden tres pulsos de silencio antes de la anacrusa; las dos ligaduras internas se expresan como una nota de tres pulsos y una blanca. Alturas sonoras de soprano; tempo de estudio propio. No se valida el audio histórico."},
{"id":"cumpleanos-revisada","title":"Cumpleaños feliz · adaptación de estudio","subtitle":"Nueve compases en 3/4 · SOL mayor · FA sostenido","phase":5,"level":"Intermedio","beatsPerBar":3,"bpm":72,"events":CUMPLE_BARS.flat(),"tip":"Cuenta dos pulsos de silencio; después toca los dos RE cortos del comienzo. El RE de la tercera frase es agudo. Escucha primero al 60 %.","error":"Empezar en el primer pulso, confundir el RE agudo con el grave o tocar FA natural.","source":"Happy Birthday, pieza 21 del cancionero. Melodía en SOL mayor contrastada visualmente con Happy Birthday Recorder Sheet Music de Kids Play Music (2024/07). Adaptación de estudio: dos pulsos de silencio antes de la anacrusa y un pulso de silencio al terminar; calderón final normalizado a dos pulsos. 25 notas, nueve compases completos en 3/4. Alturas sonoras de soprano; tempo propio. No se valida la secuencia ni el audio histórico."},
{"id":"peces-estribillo-revisado","title":"Los peces en el río · estribillo revisado","subtitle":"Fragmento de ocho compases · SOL menor · sin estrofa","phase":5,"level":"Intermedio","bpm":72,"events":PECES_REFRAIN_BARS.flat(),"tip":"Prepara SI bemol y FA sostenido antes de empezar. Repite los dos primeros compases despacio y respira en los silencios.","error":"Tocar SI natural o confundir este estribillo con la canción completa. La estrofa todavía no está incluida.","source":"Los peces en el río, pieza 62 del cancionero. Fuente: Música Secundaria, PDF y archivo MuseScore Los peces, primera voz Flauta-Xilófono, compases 10–17. Fragmento de estudio monofónico en SOL menor, sin estrofa ni repeticiones. Al final del compás 17 se sustituyen las dos semicorcheas SOL–LA de entrada a la estrofa por medio pulso de silencio; no se altera el resto del estribillo. Alturas sonoras de soprano; tempo de estudio propio. El archivo histórico permanece sin validar."},
{id:'estrellitas-revisada',title:'Estrellitas · versión didáctica revisada',subtitle:'Melodía completa de iniciación · DO mayor · 12 compases',phase:3,level:'Básico',bpm:72,events:[...phrase(['C5','C5','G5','G5','A5','A5','G5']),...phrase(['F5','F5','E5','E5','D5','D5','C5']),...phrase(['G5','G5','F5','F5','E5','E5','D5']),...phrase(['G5','G5','F5','F5','E5','E5','D5']),...phrase(['C5','C5','G5','G5','A5','A5','G5']),...phrase(['F5','F5','E5','E5','D5','D5','C5'])],tip:'La última nota de cada frase dura dos pulsos. Las otras duran uno. Respira después de cada frase.',error:'Dar a todas las notas la misma duración. El audio de esta versión sí respeta el ritmo indicado.',source:'Melodía tradicional Ah! vous dirai-je, maman; arreglo didáctico propio simplificado en 4/4, sin adornos, contrastado con el tema de KV265 (Mutopia 2236) y las notas de Estrellitas del cancionero aportado.'},
{id:'oda-revisada',title:'Oda a la alegría · tema inicial revisado',subtitle:'Tema inicial de ocho compases · adaptación en DO mayor',phase:3,level:'Básico',bpm:72,events:[...['E5','E5','F5','G5','G5','F5','E5','D5','C5','C5','D5','E5'].map(n=>({n,b:1})),{n:'E5',b:1.5},{n:'D5',b:.5},{n:'D5',b:2},...['E5','E5','F5','G5','G5','F5','E5','D5','C5','C5','D5','E5'].map(n=>({n,b:1})),{n:'D5',b:1.5},{n:'C5',b:.5},{n:'C5',b:2}],tip:'Escucha el final de cada grupo: negra con puntillo, corchea y blanca. Cuenta «uno y dos y, tres y cuatro y».',error:'Tocar todas las notas iguales o confundir esta adaptación con las variantes preliminares del cancionero.',source:'L. van Beethoven; ocho primeros compases de la voz soprano de Ode to Joy, edición Peter Chubb / Mutopia 528 (dominio público), transpuestos de SOL mayor a DO mayor para la iniciación. Tempo de estudio propio.'},
{id:'rodolfo-inicio-revisado',title:'Rodolfo el reno · comienzo revisado',subtitle:'Primeros cuatro compases · fragmento, no canción completa',phase:4,level:'Intermedio',bpm:72,events:[{n:'G5',b:.5},{n:'A5',b:1},{n:'G5',b:.5},{n:'E5',b:1},{n:'C6',b:1},{n:'A5',b:1},{n:'G5',b:2},{n:null,b:1},{n:'G5',b:.5},{n:'A5',b:.5},{n:'G5',b:.5},{n:'A5',b:.5},{n:'G5',b:1},{n:'C6',b:1},{n:'B5',b:3},{n:null,b:1}],tip:'Escucha primero al 60 %. DO es agudo: tapa el pulgar y el segundo agujero. Respira durante los silencios. El SI final dura tres pulsos.',error:'Confundir DO agudo con DO grave o tocar todas las notas con igual duración.',source:'Fragmento inicial de la pieza 87 del cancionero aportado, página PDF 32; ritmo y registro contrastados con compases 1–4 de Rodolfo el reno, arreglo Voz/Flauta de Jorge Benayas y Ester López (Listen, Play, Create). Se conserva solo el fragmento coincidente. La soprano suena una octava por encima de la escritura. Tempo de estudio propio.'},
{id:'rodolfo-seccion-revisada',title:'Rodolfo el reno · primera sección revisada',subtitle:'16 compases · dos estrofas · sin puente ni final',phase:4,level:'Intermedio',bpm:72,events:RODOLFO_SECTION_BARS.flat(),tip:'Escucha al 60 %. Estudia de cuatro en cuatro compases. Respira en los silencios; las notas de tres pulsos deben mantenerse. DO es agudo, FA y RE son graves.',error:'Confundir la duración de las corcheas con la de las negras. Las frases de los compases 7–8 y 15–16 terminan de forma diferente.',source:'Pieza 87 del cancionero aportado, página PDF 32. Se adopta para el estudio la versión Voz/Flauta de Jorge Benayas y Ester López (Listen, Play, Create), compases 1–16, leídos visualmente. Esta referencia fija ritmos y registros y difiere de la secuencia abreviada del cancionero en algunos finales de frase. No es la canción completa: faltan puente y sección final. Alturas sonoras de soprano; MusicXML escrito una octava por debajo.'},
{id:'rodolfo-puente-revisado',title:'Rodolfo el reno · puente revisado',subtitle:'Compases 17–24 · ocho compases · FA sostenido',phase:5,level:'Intermedio',bpm:72,events:RODOLFO_BRIDGE_BARS.flat(),tip:'Aprende primero FA sostenido: tapa 0, 1, 2, 3, 5, 6 y 7. El dedo 4 queda levantado. Escucha al 60 % y practica el grupo RE–MI–FA sostenido–RE.',error:'Confundir FA con FA sostenido o mantener la alteración en las frases siguientes: solo el FA marcado es sostenido.',source:rodolfoSource},
{id:'rodolfo-final-revisado',title:'Rodolfo el reno · final revisado',subtitle:'Compases 25–33 · nueve compases · cierre monofónico',phase:4,level:'Intermedio',bpm:72,events:RODOLFO_ENDING_BARS.flat(),tip:'El RE del penúltimo grupo es agudo: deja el pulgar abierto y tapa solo el agujero 2. Termina con DO agudo y cuenta también los silencios finales.',error:'Repetir el final de la primera estrofa: esta última frase sube hasta RE agudo y resuelve en DO agudo.',source:rodolfoSource},
{id:'rodolfo-completa-revisada',title:'Rodolfo el reno · adaptación completa revisada',subtitle:'33 compases · sin repeticiones · soprano alemana',phase:5,level:'Intermedio',bpm:72,events:RODOLFO_COMPLETE_BARS.flat(),tip:'Trabaja primero la sección inicial, el puente y el final por separado. Después une todo al 60 %. Respira en los silencios y prepara FA sostenido antes del puente.',error:'Confundir esta adaptación completa sin repeticiones con la secuencia abreviada del cancionero o con la práctica inicial de 16 compases.',source:rodolfoSource},
{id:'campanero-revisado',title:'Campanero · versión revisada',subtitle:'Frère Jacques · ocho compases · SI bemol',phase:5,level:'Intermedio',bpm:72,events:CAMPANERO_BARS.flat(),tip:'Prepara SI bemol: tapa 0, 1, 3 y 4. El agujero 2 queda abierto. Repite cada frase despacio; el final baja hasta DO grave.',error:'Tocar SI natural donde aparece SI bemol o subir el DO final una octava.',source:'Melodía tradicional francesa Frère Jacques, pieza 10 del cancionero aportado. Versión para soprano según la sección FaM de la edición de Música Secundaria (Frere_Jacques flauta dulce.pdf), ocho compases en 4/4 leídos visualmente. Se elige esta tonalidad para mantener el final en el registro de soprano; los SI bemoles se muestran explícitos.'},
{id:'noche-paz-revisada',title:'Noche de paz · adaptación de estudio',subtitle:'24 compases en 3/4 · DO mayor · MI y FA agudos',phase:5,level:'Intermedio',beatsPerBar:3,bpm:72,events:NOCHE_PAZ_BARS.flat(),tip:'Cuenta uno, dos, tres en cada compás. Una nota con tres pulsos se mantiene todo el compás. Aprende MI y FA agudos con el pulgar semicerrado antes de unir la melodía.',error:'Contar cuatro pulsos o confundir una nota de tres pulsos con tres notas repetidas. El último compás es silencio para respirar.',source:'Franz Xaver Gruber, Stille Nacht, voz soprano de la edición Mutopia 1295 / Steve Dunlop (dominio público), contrastada en PDF y LilyPond. Adaptación propia a DO mayor para soprano y estudio en 3/4: duraciones de la voz duplicadas y cada compás 6/8 dividido en dos de 3/4; los tres últimos pulsos del sonido final se convierten en silencio para respirar. Corresponde a la pieza 75 del cancionero, no a una transcripción literal de sus notas abreviadas.'}
];
export const REVIEW_SOURCES=[{"label": "Dulce Navidad / Jingle Bells: voz Flauta I", "url": "https://www.musicasecundaria.com/Navidad/partiturasvillancicos/Jingle%20Bells.pdf"},{"label": "Fum, fum, fum: voz Flauta I", "url": "https://www.musicasecundaria.com/Navidad/partiturasvillancicos/Fun%20Fun%20Fun.pdf"},{"label": "Campana sobre campana: fuente Flauta I", "url": "https://www.musicasecundaria.com/Navidad/partiturasvillancicos/Campana.pdf"},{"label": "Adeste fideles: partitura Flauta 1", "url": "https://www.musicasecundaria.com/Navidad/partiturasvillancicos/Adeste%20fideles.pdf"},{"label": "Los peces en el río: fuente del estribillo", "url": "https://www.musicasecundaria.com/Navidad/partiturasvillancicos/Los%20peces.pdf"},{"label": "Cumpleaños feliz: partitura de referencia", "url": "https://www.kidsplaymusic.com/wp-content/uploads/2024/07/Happy-Birthday-Recorder-Sheet-Music.pdf"},{label:'Campanero: versión FaM para soprano',url:'https://www.musicasecundaria.com/Partituras/Popular/Frere_Jacques%20flauta%20dulce.pdf'},{label:'Noche de paz: voz soprano de Mutopia 1295',url:'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1295'},{label:"Rodolfo el reno: referencia musical de las secciones y el final",url:"https://listenplaycreate.wordpress.com/wp-content/uploads/2020/12/rodolfo-el-reno.pdf"},{label:'Oda a la alegría: fuente musical de la melodía',url:'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=528'},{label:'Estrellitas: referencia del tema Ah! vous dirai-je, maman',url:'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=2236'},{label:'Digitación de soprano alemana: tabla Yamaha',url:'https://www.yamaha.com/en/musical_instrument_guide/common/images/recorder/fingering_german.pdf'}];

// El PDF contiene dos páginas; Rodolfo dispone de MusicXML propio, sin remitir a otra obra.
export function reviewedScore(id:string){
 const page=({'estrellitas-revisada':1,'oda-revisada':2} as Record<string,number>)[id];
 return page?{url:'/fuentes/partituras-revisadas.pdf#page='+page,label:'Abrir partitura revisada con nombres de notas ↗'}:{url:'/repertorio/'+id+'.musicxml',label:'Descargar partitura MusicXML para MuseScore'};
}

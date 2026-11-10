import type {Exercise,Event} from './catalog.ts';

const bar=(...events:[string,number][]):Event[]=>events.map(([n,b])=>({n,b}));

// Cotejo visual de los ocho compases de la partitura SI–LA–SOL de
// Las corcheas de Cristina (5-11-2024). Alturas sonoras de soprano.
export const LLOVIENDO_BARS:Event[][]=[
 bar(['B5',.5],['B5',.5],['A5',.5],['A5',.5]),
 bar(['G5',2]),
 bar(['B5',.5],['B5',.5],['A5',.5],['A5',.5]),
 bar(['G5',2]),
 bar(['B5',1],['A5',1]),
 bar(['B5',1],['A5',1]),
 bar(['B5',.5],['B5',.5],['A5',.5],['A5',.5]),
 bar(['G5',2]),
];

// Pedro Peregrín González, Libro de partituras, página PDF 2.
// La melodía se conserva sin acompañamiento; no se atribuye su ritmo al OCR.
export const MUNECA_BARS:Event[][]=[
 bar(['G5',.5],['G5',.5],['G5',.5],['A5',.5]),
 bar(['G5',.5],['E5',.5],['C5',.5],['E5',.5]),
 bar(['G5',1],['A5',1]),
 bar(['G5',2]),
 bar(['F5',.5],['F5',.5],['F5',.5],['G5',.5]),
 bar(['F5',.5],['E5',.5],['D5',.5],['E5',.5]),
 bar(['F5',1],['D5',1]),
 bar(['C5',2]),
];

// Yamaha #SoundItOut piano, PDF page 9: last three eighths of bar 2,
// then melody bars 3-14. Written E-flat -> G; soprano sounding octave.
// Straight eighths for first study; source swing and introduction omitted.
export const SAINTS_BARS:Event[][]=[
 [{n:null,b:2.5},{n:'G5',b:.5},{n:'B5',b:.5},{n:'C6',b:.5}],
 [{n:'D6',b:2},{n:null,b:.5},{n:'G5',b:.5},{n:'B5',b:.5},{n:'C6',b:.5}],
 [{n:'D6',b:2},{n:null,b:.5},{n:'G5',b:.5},{n:'B5',b:.5},{n:'C6',b:.5}],
 bar(['D6',1],['B5',1],['G5',1],['B5',1]),
 [{n:'A5',b:2},{n:null,b:.5},{n:'B5',b:.5},{n:'B5',b:.5},{n:'A5',b:.5}],
 bar(['G5',1.5],['G5',.5],['B5',1],['D6',1]),
 bar(['D6',.5],['C6',2.5],['B5',.5],['C6',.5]),
 bar(['D6',1],['B5',1],['G5',1],['A5',1]),
 [{n:'G5',b:2},{n:null,b:.5},{n:'B5',b:.5},{n:'B5',b:.5},{n:'A5',b:.5}],
 bar(['G5',1.5],['G5',.5],['B5',1],['D6',1]),
 bar(['D6',.5],['C6',2.5],['B5',.5],['C6',.5]),
 bar(['D6',1],['B5',1],['G5',1],['A5',1]),
 [{n:'G5',b:2},{n:null,b:2}],
];

export const BEGINNER_REVIEWED_EXERCISES:Exercise[]=[
 {id:'santos-revisada',title:'Marcha de los Santos · adaptación revisada',subtitle:'Cinco notas · entrada y 12 compases · corcheas regulares',phase:2,level:'Principiante',beatsPerBar:4,bpm:64,events:SAINTS_BARS.flat(),tip:'Escucha al 60 %. Entra después de dos pulsos y medio de silencio: SOL, SI, DO agudo. En RE agudo abre el pulgar y tapa solo el agujero 2. Las dos figuras unidas de DO se soplan una sola vez y duran dos pulsos y medio.',error:'Tocar DO o RE graves en lugar de agudos, volver a soplar en la ligadura o confundir esta versión de corcheas regulares con el swing de la fuente.',source:'Melodía tradicional When the Saints Go Marching In; alternativa de estudio para la pieza 66 del cancionero. Cotejo visual: Yamaha, #SoundItOut, Piano music score and tips, página PDF 9, compases 3-14 y las tres corcheas finales del 2. Fuente: https://www.yamaha.com/en/about/experience/promotion/sound-it-out/files/piano_music_score_en.pdf. Se extrae únicamente la melodía superior, se transpone de MI bemol a SOL y se omiten los dos compases de introducción salvo las tres notas de entrada. La entrada se completa con dos pulsos y medio de silencio. Adaptación inicial con corcheas regulares: no reproduce el swing de la fuente. Se conservan las ligaduras internas como un solo sonido de dos pulsos y medio y se normaliza el calderón final a dos pulsos. Trece compases completos de 4/4, digitación soprano alemana y tempo de estudio propio. No certifica la guía abreviada ni el MP3 histórico.'},
 {id:'lloviendo-revisada',title:'Ya lloviendo está · versión revisada',subtitle:'SI–LA–SOL · ocho compases en 2/4',phase:1,level:'Principiante',beatsPerBar:2,bpm:64,events:LLOVIENDO_BARS.flat(),tip:'Escucha primero al 60 %. Las dos notas cortas caben en un pulso. Mantén el SOL de dos pulsos sin volver a soplar y respira al terminar la frase.',error:'Dar la misma duración a las notas cortas y al SOL largo, u omitir la segunda frase.',source:'Canción infantil Ya lloviendo está, pieza 115 del cancionero. Cotejo visual de alturas y duraciones con la partitura SI–LA–SOL publicada por Las corcheas de Cristina el 5-11-2024: https://lascorcheasdecristina.blogspot.com/2024/11/. Ocho compases en 2/4 y 19 notas; se conserva la segunda frase, ausente de la secuencia abreviada anterior. Una pasada, sin repetición añadida. Alturas sonoras de soprano, digitación alemana y tempo de estudio propio. No certifica el MP3 histórico.'},
 {id:'muneca-revisada',title:'Tengo una muñeca · versión revisada',subtitle:'Ocho compases en 2/4 · mano derecha y FA alemán',phase:3,level:'Principiante',beatsPerBar:2,bpm:64,events:MUNECA_BARS.flat(),tip:'Practica los dos primeros compases despacio. Mantén los dedos cerca de los agujeros y usa aire suave para los DO y RE graves. El FA se toca con la digitación alemana del dibujo.',error:'Tocar DO y RE graves como agudos, o acortar las notas largas del final de cada frase.',source:'Melodía popular Tengo una muñeca, pieza 100 del cancionero. Alturas y duraciones cotejadas visualmente con Pedro Peregrín González, Libro de partituras, página PDF 2, publicado por IES A Sardiñeira (Xunta de Galicia): https://www.edu.xunta.gal/centros/iessardineira/system/files/Partituras%20Flauta%20variadas%202.pdf. Se conserva la línea monofónica de ocho compases en 2/4, 22 notas, sin acompañamiento ni repeticiones añadidas. Alturas sonoras de soprano y tempo de estudio propio; la edición abreviada y el MP3 histórico siguen conservados aparte.'},
];

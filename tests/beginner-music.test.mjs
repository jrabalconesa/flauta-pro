import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BEGINNER_REVIEWED_EXERCISES} from '../lib/beginner-reviewed-music.ts';
import {musicXml,fingeringFor} from '../lib/catalog.ts';

// Golden readings transcribed visually from the cited source staves, in
// written concert-note names before the soprano's octave transposition.
const readings={
 'lloviendo-revisada':[
  [['B',.5],['B',.5],['A',.5],['A',.5]],[['G',2]],
  [['B',.5],['B',.5],['A',.5],['A',.5]],[['G',2]],
  [['B',1],['A',1]],[['B',1],['A',1]],
  [['B',.5],['B',.5],['A',.5],['A',.5]],[['G',2]],
 ],
 'muneca-revisada':[
  [['G',.5],['G',.5],['G',.5],['A',.5]],
  [['G',.5],['E',.5],['C',.5],['E',.5]],
  [['G',1],['A',1]],[['G',2]],
  [['F',.5],['F',.5],['F',.5],['G',.5]],
  [['F',.5],['E',.5],['D',.5],['E',.5]],
  [['F',1],['D',1]],[['C',2]],
 ],
};
test('new beginner melodies preserve the source notes, rhythms and eight two-beat bars',()=>{
 for(const ex of BEGINNER_REVIEWED_EXERCISES.filter(e=>e.id!=='santos-revisada')){
  const expected=readings[ex.id];assert.equal(expected.length,8);
  assert.deepEqual(ex.events,expected.flat().map(([n,b])=>({n:n+'5',b})));
  assert.equal(ex.beatsPerBar,2);
  assert.equal(ex.events.reduce((s,e)=>s+e.b,0),16);
  assert.equal((musicXml(ex).match(/<measure number=/g)||[]).length,8);
  for(const bar of expected)assert.equal(bar.reduce((s,[,b])=>s+b,0),2);
  for(const event of ex.events)assert.ok(fingeringFor(event.n,'alemana'));
 }
 const rain=BEGINNER_REVIEWED_EXERCISES.find(e=>e.id==='lloviendo-revisada');
 assert.equal(rain.phase,1);assert.equal(rain.events.length,19);
 assert.deepEqual([...new Set(rain.events.map(e=>e.n))].sort(),['A5','B5','G5']);
 assert.equal(BEGINNER_REVIEWED_EXERCISES.find(e=>e.id==='muneca-revisada').events.length,22);
});

// Independently read melody from Yamaha piano PDF page 9, source bars 3-14.
// Source written E-flat notes transposed a major third to G.
test('Saints preserves the twelve source melody bars, pickup and tied holds',()=>{
 const ex=BEGINNER_REVIEWED_EXERCISES.find(e=>e.id==='santos-revisada');
 const source=[
  'Bb:2 R:.5 Eb:.5 G:.5 Ab:.5','Bb:2 R:.5 Eb:.5 G:.5 Ab:.5',
  'Bb:1 G:1 Eb:1 G:1','F:2 R:.5 G:.5 G:.5 F:.5',
  'Eb:1.5 Eb:.5 G:1 Bb:1','Bb:.5 Ab:2.5 G:.5 Ab:.5',
  'Bb:1 G:1 Eb:1 F:1','Eb:2 R:.5 G:.5 G:.5 F:.5',
  'Eb:1.5 Eb:.5 G:1 Bb:1','Bb:.5 Ab:2.5 G:.5 Ab:.5',
  'Bb:1 G:1 Eb:1 F:1','Eb:2 R:2'];
 const pitches={Eb:'G5',F:'A5',G:'B5',Ab:'C6',Bb:'D6',R:null};
 const expected=[{n:null,b:2.5},{n:'G5',b:.5},{n:'B5',b:.5},{n:'C6',b:.5},...source.flatMap(bar=>bar.split(' ').map(s=>{const [n,b]=s.split(':');return {n:pitches[n],b:Number(b)}}))];
 assert.deepEqual(ex.events,expected);assert.equal(ex.events.reduce((s,e)=>s+e.b,0),52);
 assert.equal(ex.phase,2);assert.equal(ex.beatsPerBar,4);
 const xml=musicXml(ex);assert.equal((xml.match(/<measure number=/g)||[]).length,13);
 assert.equal((xml.match(/<tie type="start"/g)||[]).length,2);
 assert.equal((xml.match(/<tie type="stop"/g)||[]).length,2);
 assert.match(ex.source,/corcheas regulares/);
 for(const e of ex.events)if(e.n)assert.ok(fingeringFor(e.n,'alemana'));
});

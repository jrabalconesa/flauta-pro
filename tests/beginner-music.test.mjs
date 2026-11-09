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
 for(const ex of BEGINNER_REVIEWED_EXERCISES){
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

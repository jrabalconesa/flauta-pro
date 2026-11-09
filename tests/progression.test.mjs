import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EXERCISES,recommend} from '../lib/catalog.ts';
const practice=(e,date)=>({exerciseId:e.id,date,mode:'free',reliable:true,completed:true,pitchScore:90});
const passed=e=>[practice(e,Date.UTC(2026,10,1,12)),practice(e,Date.UTC(2026,10,1,13)),practice(e,Date.UTC(2026,10,2,12))];
test('shared exercise order never moves to a lower phase and keeps all exercise IDs unique',()=>{
 assert.equal(EXERCISES[0].id,'primer-si');
 assert.equal(new Set(EXERCISES.map(e=>e.id)).size,EXERCISES.length);
 for(let i=1;i<EXERCISES.length;i++)assert.ok(EXERCISES[i].phase>=EXERCISES[i-1].phase);
 assert.ok(EXERCISES.findIndex(e=>e.id==='estrellitas-revisada')<EXERCISES.findIndex(e=>e.id==='dulce-navidad-revisada'));
});
test('recommendations traverse every eligible exercise in phase order using existing history',()=>{
 for(const system of ['alemana','barroca']){
  const eligible=EXERCISES.filter(e=>e.id!=='cordero'&&(system==='barroca'||!e.baroqueOnly));
  const history=[];
  for(const e of eligible){assert.equal(recommend(history,system).exercise.id,e.id);history.push(...passed(e));}
 }
});
test('three attempts on the same day and unreliable captures do not advance the recommendation',()=>{
 const ex=EXERCISES[0],day=Date.UTC(2026,10,1,12);
 assert.equal(recommend([0,1,2].map(i=>practice(ex,day+i*3600000))).exercise.id,ex.id);
 assert.equal(recommend(passed(ex).map(a=>({...a,reliable:false}))).exercise.id,ex.id);
});

test('German eligibility depends on every actual note, including unmarked exercises',async()=>{
 const {supportsExercise,fingeringFor}=await import('../lib/catalog.ts');
 assert.deepEqual(fingeringFor('F5','alemana').holes,[0,1,2,3,4]);
 assert.deepEqual(fingeringFor('F5','barroca').holes,[0,1,2,3,4,6,7]);
 assert.deepEqual(fingeringFor('E6','alemana').halfHoles,[0]);
 assert.equal(fingeringFor('B5','yrf21'),null);
 assert.equal(supportsExercise({...EXERCISES[0],events:[{n:'E6',b:4}]},'alemana'),true);
 assert.equal(supportsExercise({...EXERCISES[0],events:[{n:'unknown',b:4}]},'barroca'),false);
 for(const e of EXERCISES.filter(e=>supportsExercise(e,'alemana')))
  assert.ok(e.events.every(ev=>!ev.n||fingeringFor(ev.n,'alemana')));
});

test('all interactive songs support German, with distinct F sharp and upper F positions',async()=>{
 const {supportsExercise,fingeringFor}=await import('../lib/catalog.ts');
 for(const e of EXERCISES)assert.ok(supportsExercise(e,'alemana'),e.id);
 assert.deepEqual(fingeringFor('F#5','alemana').holes,[0,1,2,3,5,6,7]);
 assert.deepEqual(fingeringFor('F6','alemana').holes,[1,2,3,4]);
 assert.deepEqual(fingeringFor('F6','alemana').halfHoles,[0]);
 assert.deepEqual(fingeringFor('Bb5','alemana').holes,[0,1,3,4]);
});

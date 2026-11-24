import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateLearners,INITIAL_INSTRUMENTS} from '../lib/learners.ts';
const data=JSON.parse(fs.readFileSync('lib/cancionero-v93.json','utf8'));
test('the imported manual has 116 complete study fiches and three appendix fiches, without legacy variants',()=>{
 assert.equal(data.songs.filter(s=>s.kind==='active').length,116);
 assert.equal(data.songs.filter(s=>s.kind==='archive').length,3);
 assert.equal(data.songs.length,119);
 assert.equal(new Set(data.songs.map(s=>s.id)).size,119);
 assert.equal(new Set(data.songs.map(s=>s.studyKey)).size,119);
 assert.ok(data.songs.every(s=>Number(s.studyKey)>=400&&!s.legacyId));
 for(const s of data.songs){
  assert.ok(s.page>=1&&s.page<=285,s.title);
  assert.equal(fs.readFileSync('public'+s.pdf).subarray(0,5).toString(),'%PDF-',s.title);
  assert.ok(fs.readFileSync('public'+s.xml,'utf8').includes('<score-partwise'),s.title);
  for(const speed of ['060','080','100']){
   assert.equal(fs.readFileSync('public'+s.midi[speed]).subarray(0,4).toString(),'MThd',s.title);
   const b=fs.readFileSync('public'+s.audio[speed]);assert.ok(b.length>1000,s.title);
   assert.ok(b.subarray(0,3).toString()==='ID3'||b[0]===255&&(b[1]&224)===224,s.title);
  }
 }
 assert.ok(!fs.existsSync('public/repertorio/mp3'));
 assert.ok(!fs.existsSync('lib/repertoire.ts'));
});
test('all four study groups resolve to existing study files without storing duplicate archives',()=>{
 assert.equal(data.groups.length,4);
 for(const group of data.groups)assert.ok(data.packages.some(p=>p.group===group));
 for(const p of data.packages){assert.ok(p.files.length>0);assert.ok(p.files.every(f=>fs.existsSync('public'+f.path)));assert.equal(new Set(p.files.map(f=>f.name)).size,p.files.length);assert.ok(!fs.existsSync('public/cancionero-v93/'+p.filename));}
});
test('all new study states fit the existing profile validation without migrating earlier song progress',()=>{
 const songs=Object.fromEntries(data.songs.map(s=>[s.studyKey,{status:'En aprendizaje',style:'Sin clasificar',meter:'Sin clasificar',type:'Canción'}]));
 assert.doesNotThrow(()=>validateLearners({learners:[{id:'default',name:'Jose',system:'alemana',minutes:10,instrumentId:'flute-1',songs}],instruments:INITIAL_INSTRUMENTS}));
});

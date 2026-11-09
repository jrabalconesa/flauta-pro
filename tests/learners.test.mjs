import {test} from 'node:test';
import assert from 'node:assert/strict';
import {learnerSettings,scopedRows,sessionKey,validateLearners} from '../lib/learners.ts';
import {makeBackup,validateBackup,mergeBackup} from '../lib/backup.ts';
import {EXERCISES,NOTES,musicXml,recommend} from '../lib/catalog.ts';
const now=Date.now(),ids=EXERCISES.map(e=>e.id),base={kind:'profile',date:now,name:'Jose',system:'barroca',minutes:10};
test('legacy history remains under the original learner; a second learner starts empty',()=>{const s=learnerSettings(base);assert.equal(s.learners[0].id,'default');assert.equal(s.learners[0].name,'Jose');assert.equal(s.instruments.length,2);const rows=[{kind:'attempt',attemptId:'old'},{kind:'attempt',attemptId:'new',profileId:'second'}];assert.equal(scopedRows(rows,'default')[0].attemptId,'old');assert.equal(scopedRows(rows,'second').length,1);assert.equal(sessionKey('u'),'session_u');assert.equal(sessionKey('u','default'),'session_u');assert.notEqual(sessionKey('u','second'),sessionKey('u'));});
test('all learners, instruments, song states and separate sessions survive backup round trips',()=>{const s=learnerSettings(base);s.learners.push({...s.learners[0],id:'second',name:'Alumno 2',songs:{64:{status:'En aprendizaje',style:'Tradicional',meter:'4/4',type:'Canción'}}});const session={kind:'session',date:now,exerciseId:'primer-si',index:0,completed:false,profileSystem:'barroca',minutes:10,self:[]};const b=makeBackup([{...base,...s},session,{...session,profileId:'second'}],ids),round=validateBackup(JSON.parse(JSON.stringify(b)),ids);assert.equal(round.version,2);assert.equal(round.rows[0].learners[1].songs[64].status,'En aprendizaje');assert.equal(round.rows.filter(r=>r.kind==='session').length,2);assert.equal(mergeBackup([],round).writes.length,3);});
test('a legacy imported profile cannot erase additional learners or their inventory',()=>{const s=learnerSettings(base);s.learners.push({...s.learners[0],id:'second',name:'Alumno 2'});const current={...base,...s};const b=validateBackup({app:'flauta-pro',version:1,exportedAt:now,rows:[{...base,name:'Jose actualizado',date:now+1}]},ids);const write=mergeBackup([current],b).writes[0];assert.equal(write.learners.length,2);assert.equal(write.learners[0].name,'Jose actualizado');assert.equal(write.instruments.length,2);});
test('a newer version-two copy also retains learners and instruments absent from that copy',()=>{
 const original=learnerSettings(base);
 const current={...base,...original,learners:[...original.learners,{...original.learners[0],id:'second',name:'Alumno 2',instrumentId:'third'}],instruments:[...original.instruments,{id:'third',name:'Instrumento conservado',system:'alemana',notes:'Preferencias del segundo perfil'}]};
 const copy=makeBackup([{...base,...original,date:now+1}],ids);
 const write=mergeBackup([current],copy).writes[0];
 assert.equal(write.learners.length,2);assert.equal(write.instruments.length,3);
 assert.equal(write.learners.find(l=>l.id==='second').instrumentId,'third');
 assert.equal(write.instruments.find(i=>i.id==='third').notes,'Preferencias del segundo perfil');
 validateLearners(write);
});
test('invalid learner and instrument references are rejected',()=>{const s=learnerSettings(base);assert.throws(()=>validateLearners({...s,learners:[{...s.learners[0],instrumentId:'missing'}]}));assert.throws(()=>validateLearners({...s,learners:[{...s.learners[0],id:'../../other'}]}));});
test('exercises use known notes and MusicXML exports eighths and accidentals correctly',()=>{for(const e of EXERCISES){for(const ev of e.events)assert.ok(!ev.n||NOTES.some(n=>n.id===ev.n),e.id);assert.equal(e.events.reduce((t,v)=>t+v.b,0)%(e.beatsPerBar??4),0,e.id);}assert.ok(musicXml(EXERCISES.find(e=>e.id==='corcheas')).includes('<duration>1</duration><type>eighth</type>'));assert.ok(musicXml(EXERCISES.find(e=>e.id==='alteraciones')).includes('<alter>1</alter>'));assert.ok(!recommend([],'alemana').exercise.baroqueOnly);for(const n of NOTES.filter(n=>n.halfHoles?.includes(0)))assert.ok(!n.holes.includes(0));});
test('placeholder instruments become Hohner German and Yamaha fife without losing historical IDs',()=>{
 const old={...base,instruments:[{id:'flute-1',name:'Mi flauta dulce 1',system:'alemana',notes:'Primera flauta del proyecto.'},{id:'flute-2',name:'Mi flauta dulce 2',system:'barroca',notes:'Nota personal'}],learners:[{id:'default',name:'Jose',system:'barroca',minutes:10,instrumentId:'flute-2'}]};
 const next=learnerSettings(old);assert.equal(next.instruments[0].system,'alemana');assert.equal(next.instruments[1].system,'yrf21');assert.match(next.instruments[1].notes,/Nota personal/);assert.equal(next.learners[0].instrumentId,'flute-1');assert.equal(next.learners[0].system,'alemana');validateLearners(next);assert.deepEqual(learnerSettings(next),next);
 const custom={...old,instruments:old.instruments.map(i=>({...i,name:'Mi instrumento personalizado'}))};assert.deepEqual(learnerSettings(custom).instruments,custom.instruments);
});

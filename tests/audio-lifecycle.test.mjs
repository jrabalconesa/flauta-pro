import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const compiled=ts.transpileModule(readFileSync(new URL('../app/audio.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
const exercise={id:'test',bpm:60,events:[]};
function harness({resume=async()=>{},getUserMedia=async()=>{throw Error('Unexpected microphone request');}}={}){
 const changes=[],exports={};let requested=0,sourceCount=0;
 class Context{currentTime=0;resume=resume;createMediaStreamSource(){sourceCount++;throw Error('Unexpected microphone processing');}}
 const scope={exports,require(name){
  if(name==='react')return {useRef:value=>({current:value}),useState:value=>[value,next=>changes.push(next)],useEffect:()=>{}};
  if(name.includes('practice-timing'))return {secondsPerBeat:()=>1};
  return {};
 },AudioContext:Context,navigator:{mediaDevices:{getUserMedia:options=>{requested++;return getUserMedia(options);}}},requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{},setTimeout:()=>1,clearTimeout:()=>{},Blob,URL,console};
 vm.runInNewContext(compiled,scope);
 return {audio:exports.useRecorderAudio(),changes,get requested(){return requested;},get sourceCount(){return sourceCount;}};
}
test('stopping while audio permission resumes cannot restart playback or request a microphone',async()=>{
 for(const operation of ['play','listen']){
  const gate=deferred(),h=harness({resume:()=>gate.promise});
  const pending=operation==='play'?h.audio.play(exercise,1,.2):h.audio.listen(exercise,'free',1,false,()=>{});
  h.audio.stop();const before=h.changes.length;gate.resolve();await pending;
  assert.equal(h.requested,0);assert.equal(h.sourceCount,0);assert.equal(h.changes.length,before);
 }
});
test('late microphone permission is released after stop even when a new playback has started',async()=>{
 const gate=deferred();let stopped=0;
 const h=harness({getUserMedia:()=>gate.promise});
 const pending=h.audio.listen(exercise,'free',1,false,()=>{});
 await new Promise(setImmediate);assert.equal(h.requested,1);
 h.audio.stop();await h.audio.play(exercise,1,.2);
 const before=h.changes.length;gate.resolve({getTracks:()=>[{stop(){stopped++;}}]});await pending;
 assert.equal(stopped,1);assert.equal(h.sourceCount,0);assert.equal(h.changes.length,before);
});
test('a failed audio resume releases an acquired microphone',async()=>{
 let resumes=0,stopped=0;
 const h=harness({resume:async()=>{if(++resumes===2)throw Error('resume failed');},getUserMedia:async()=>({getTracks:()=>[{stop(){stopped++;}}]})});
 await assert.rejects(h.audio.listen(exercise,'free',1,false,()=>{}),/resume failed/);
 assert.equal(stopped,1);assert.equal(h.sourceCount,0);
});

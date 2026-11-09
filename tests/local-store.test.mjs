import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as backup from '../lib/backup.ts';
import {canonicalLocalRows} from '../lib/local-records.ts';

const compiled=ts.transpileModule(readFileSync(new URL('../lib/local-store.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function store(seed){
 const rows=new Map(seed.map(r=>[r.id,r])),opened=[],exports={};
 const database={transaction(){
  const tx={objectStore:()=>objectStore};let scheduled=false;
  function complete(){if(!scheduled){scheduled=true;queueMicrotask(()=>tx.oncomplete?.());}}
  const objectStore={getAll(){const request={};queueMicrotask(()=>{request.result=structuredClone([...rows.values()]);request.onsuccess?.();complete();});return request;},put(row){rows.set(row.id,structuredClone(row));complete();},delete(id){rows.delete(id);complete();}};
  return tx;
 }};
 const indexedDB={open(name,version){opened.push([name,version]);const request={};queueMicrotask(()=>{request.result=database;request.onsuccess?.();});return request;}};
 vm.runInNewContext(compiled,{exports,indexedDB,Response,FormData,File,Blob,URL,crypto,TextEncoder,TextDecoder,Uint8Array,console,require(name){if(name==='./catalog')return {EXERCISES:[{id:'primer-si'}]};if(name==='./backup')return backup;if(name==='./local-records')return {canonicalLocalRows};throw Error(name);}});
 return {request:exports.localFetch,opened};
}
const date=1700000000000;
const profile={id:'profile',kind:'profile',date,name:'Principal',system:'alemana',minutes:10};
const session={id:'session',kind:'session',date,exerciseId:'primer-si',index:0,completed:false,profileSystem:'alemana',minutes:10,self:[]};
const settings={...profile,learners:[{id:'default',name:'Principal',system:'alemana',minutes:10,instrumentId:'flute-1'},{id:'second',name:'Segundo',system:'alemana',minutes:10,instrumentId:'flute-1'}],instruments:[{id:'flute-1',name:'Soprano',system:'alemana',notes:''}]};
test('Pages keeps the original database and separates sessions after upgrading old records',async()=>{
 const h=store([profile,session]);
 const old=await (await h.request('/api/backup')).json();assert.equal(old.version,2);assert.equal(old.rows.length,2);
 assert.deepEqual(h.opened,[['flauta-pro-pages',1]]);
 const save=async(kind,value)=>{const r=await h.request('/api/state',{method:'POST',body:JSON.stringify({kind,value})});assert.equal(r.status,200,await r.text());};
 await save('profile',settings);
 await save('session',{...session,index:1,profileId:'default'});
 await save('session',{...session,index:2,profileId:'second'});
 const current=await (await h.request('/api/backup')).json();
 assert.equal(current.rows.filter(r=>r.kind==='profile')[0].learners.length,2);
 assert.equal(current.rows.filter(r=>r.kind==='session').length,2);
 assert.equal(current.rows.find(r=>r.kind==='session'&&r.profileId==='default').index,1);
 assert.equal(current.rows.find(r=>r.kind==='session'&&r.profileId==='second').index,2);
 const imported=await h.request('/api/backup',{method:'POST',body:JSON.stringify(old)});assert.equal(imported.status,200);
 const round=await (await h.request('/api/backup')).json();assert.equal(round.rows.find(r=>r.kind==='profile').learners.length,2);
});
test('local recordings remain outside state and JSON exports and cannot target an unknown learner',async()=>{
 const h=store([settings]);
 function recording(id){const data=new FormData();data.append('file',new Blob([new Uint8Array([0x1a,0x45,0xdf,0xa3,...new Array(20).fill(0)])],{type:'audio/webm'}),'practice.webm');data.append('metadata',JSON.stringify({profileId:id,instrumentId:'flute-1',exerciseId:'primer-si'}));return data;}
 assert.equal((await h.request('/api/recordings',{method:'POST',body:recording('missing')})).status,400);
 assert.equal((await h.request('/api/recordings',{method:'POST',body:recording('second')})).status,200);
 const list=await (await h.request('/api/recordings')).json();assert.equal(list.recordings.length,1);assert.equal(list.recordings[0].profileId,'second');assert.ok(list.recordings[0].url.startsWith('blob:'));
 for(const path of ['/api/state','/api/backup']){const data=await (await h.request(path)).json();assert.ok(data.rows.every(r=>r.kind!=='recording'));}
 const removed=await h.request('/api/recordings',{method:'DELETE',body:JSON.stringify({id:list.recordings[0].id})});assert.equal(removed.status,200);
 assert.equal((await (await h.request('/api/recordings')).json()).recordings.length,0);
});

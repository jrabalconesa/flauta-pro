import {test} from 'node:test';
import assert from 'node:assert/strict';
import {acceptsMessage,SITES_ORIGIN,SYNC_CHANNEL,synchronize} from '../lib/sync-protocol.ts';
import {makeBackup,mergeBackup,recordKey} from '../lib/backup.ts';
const token='a'.repeat(64),source={},valid={origin:SITES_ORIGIN,source,data:{channel:SYNC_CHANNEL,token}};
test('only the pinned window, exact origin, protocol and current connection token are accepted',()=>{
 assert.equal(acceptsMessage(valid,SITES_ORIGIN,source,token),true);
 for(const event of [{...valid,origin:'https://evil.example'},{...valid,origin:SITES_ORIGIN+'.evil.example'},{...valid,source:{}},{...valid,source:null},{...valid,data:{...valid.data,token:'b'.repeat(64)}},{...valid,data:{...valid.data,channel:'guitarra-pro-sync-v1'}},{...valid,data:null}])assert.equal(acceptsMessage(event,SITES_ORIGIN,source,token),false);
 assert.equal(acceptsMessage(valid,SITES_ORIGIN,null,token),false);assert.equal(acceptsMessage(valid,SITES_ORIGIN,source,''),false);
});
const date=1700000000000,ids=['primer-si'];
const attempt=id=>({kind:'attempt',date,exerciseId:'primer-si',mode:'free',pitchScore:90,rhythmScore:null,coverage:100,reliable:true,completed:true,attemptId:id});
const profile=(name,date)=>({kind:'profile',date,name,system:'barroca',minutes:10});
function apply(rows,backup){const m=mergeBackup(rows,backup);const map=new Map(rows.map(r=>[recordKey(r),r]));for(const r of m.writes)map.set(recordKey(r),r);return [...map.values()];}
test('two-way sync converges, preserves dates, keeps the newest profile and is idempotent',async()=>{
 let local=[attempt('local'),profile('Antes',date)],cloud=[attempt('cloud'),profile('Actual',date+100)];
 const pass=()=>synchronize(async()=>makeBackup(local,ids),async b=>{cloud=apply(cloud,b);return makeBackup(cloud,ids)},async b=>{local=apply(local,b)});
 await pass();await pass();assert.equal(local.length,3);assert.equal(cloud.length,3);assert.equal(local.find(r=>r.kind==='profile').name,'Actual');assert.equal(local.find(r=>r.attemptId==='cloud').date,date);
 assert.deepEqual(makeBackup(local,ids).rows.sort((a,b)=>recordKey(a).localeCompare(recordKey(b))),makeBackup(cloud,ids).rows.sort((a,b)=>recordKey(a).localeCompare(recordKey(b))));
});
test('a practice saved while the network request is pending survives and is uploaded next time',async()=>{
 let local=[attempt('first')],cloud=[];
 await synchronize(async()=>makeBackup(local,ids),async b=>{local.push(attempt('during'));cloud=apply(cloud,b);return makeBackup(cloud,ids)},async b=>{local=apply(local,b)});
 assert.equal(local.length,2);assert.equal(cloud.length,1);
 await synchronize(async()=>makeBackup(local,ids),async b=>{cloud=apply(cloud,b);return makeBackup(cloud,ids)},async b=>{local=apply(local,b)});assert.equal(cloud.length,2);
});
test('network failure never replaces local data; a later retry merges without duplicating',async()=>{
 let local=[attempt('offline')],cloud=[];let merges=0;
 await assert.rejects(synchronize(async()=>makeBackup(local,ids),async()=>{throw Error('offline')},async()=>{merges++}));assert.equal(merges,0);assert.equal(local.length,1);
 for(let i=0;i<2;i++)await synchronize(async()=>makeBackup(local,ids),async b=>{cloud=apply(cloud,b);return makeBackup(cloud,ids)},async b=>{local=apply(local,b)});
 assert.equal(cloud.length,1);assert.equal(local.length,1);
});

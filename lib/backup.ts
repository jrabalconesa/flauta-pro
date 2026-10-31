export const BACKUP_VERSION = 1;
export const MAX_BACKUP_BYTES = 2 * 1024 * 1024;
type Row = Record<string, any>;
export type Backup = {app:'flauta-pro';version:1;exportedAt:number;rows:Row[]};
const object=(v:any)=>v && typeof v==='object' && !Array.isArray(v);
const fail=():never=>{throw Error('La copia contiene datos no válidos. No se ha importado nada.');};
function date(v:any){if(!Number.isSafeInteger(v)||v<0||v>Date.now()+86400000)fail();return v as number;}
function str(v:any,max=100){if(typeof v!=='string'||!v.length||v.length>max)fail();return v as string;}
function pct(v:any){if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>100)fail();return v as number;}
function legacyId(row:Row){const input=JSON.stringify([row.date,row.exerciseId,row.mode,row.pitchScore,row.rhythmScore,row.coverage]);let h=2166136261;for(const c of input)h=Math.imul(h^c.charCodeAt(0),16777619);return 'legacy-'+row.date+'-'+(h>>>0).toString(16);}
function clean(row:any,ids:string[]):Row{
 if(!object(row))return fail();
 const base={kind:row.kind,date:date(row.date)};
 if(row.kind==='profile'){
  if(!['barroca','alemana'].includes(row.system)||![10,15].includes(row.minutes))return fail();
  return {...base,name:str(row.name,80),system:row.system,minutes:row.minutes};
 }
 if(row.kind==='attempt'){
  if(!ids.includes(row.exerciseId)||!['free','timed','self'].includes(row.mode)||typeof row.completed!=='boolean'||typeof row.reliable!=='boolean')return fail();
  const self=row.mode==='self';
  const result:Row={...base,attemptId:str(row.attemptId||legacyId(row),180),exerciseId:row.exerciseId,mode:row.mode,pitchScore:pct(row.pitchScore),rhythmScore:row.rhythmScore==null?null:pct(row.rhythmScore),completed:row.completed,reliable:self?false:row.reliable,measured:self?false:row.measured!==false};
  if(row.coverage!=null)result.coverage=pct(row.coverage);
  return result;
 }
 if(row.kind==='session'){
  if(!ids.includes(row.exerciseId)||!Number.isInteger(row.index)||row.index<0||row.index>4||typeof row.completed!=='boolean'||row.completed!==(row.index===4)||!['barroca','alemana'].includes(row.profileSystem)||![10,15].includes(row.minutes)||!Array.isArray(row.self)||row.self.length>100)return fail();
  return {...base,exerciseId:row.exerciseId,index:row.index,completed:row.completed,profileSystem:row.profileSystem,minutes:row.minutes,simplified:row.simplified===true,self:row.self.map((v:any)=>{if(!object(v)||!Number.isInteger(v.step)||v.step<0||v.step>3||!['Fácil','Cómodo','Me ha costado'].includes(v.value))return fail();return {step:v.step,value:v.value,date:date(v.date)};})};
 }
 return fail();
}
export function validateBackup(value:any,ids:string[]):Backup{
 if(!object(value)||value.app!=='flauta-pro'||value.version!==BACKUP_VERSION||!Array.isArray(value.rows)||value.rows.length>2000)return fail();
 if(JSON.stringify(value).length>MAX_BACKUP_BYTES)return fail();
 const rows=value.rows.map((r:any)=>clean(r,ids));
 if(rows.filter((r:Row)=>r.kind==='profile').length>1||rows.filter((r:Row)=>r.kind==='session').length>1)return fail();
 const seen=new Set<string>();for(const r of rows){const key=recordKey(r);if(seen.has(key))return fail();seen.add(key);}
 return {app:'flauta-pro',version:1,exportedAt:date(value.exportedAt),rows};
}
export function recordKey(row:Row){return row.kind==='attempt'?'attempt_'+(row.attemptId||legacyId(row)):row.kind;}
export function makeBackup(rows:Row[],ids:string[]):Backup{
 return validateBackup({app:'flauta-pro',version:1,exportedAt:Date.now(),rows:rows.filter(r=>['profile','attempt','session'].includes(r.kind))},ids);
}
export function mergeBackup(existing:Row[],backup:Backup){
 const current=new Map(existing.filter(r=>['profile','session','attempt'].includes(r.kind)).map(r=>[recordKey(r),r]));
 const writes:Row[]=[];let duplicates=0;
 for(const row of backup.rows){const old=current.get(recordKey(row));if(old&&(row.kind==='attempt'||old.date>=row.date)){duplicates++;continue;}writes.push(row);current.set(recordKey(row),row);}
 return {writes,duplicates,attemptsAdded:writes.filter(r=>r.kind==='attempt').length};
}

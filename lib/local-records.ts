import {recordKey} from './backup.ts';
// Version-one stores used "session"; current stores use one key per learner.
// Read both without deleting history and keep the latest logical record.
export function canonicalLocalRows(rows:Record<string,any>[]){
 const map=new Map<string,Record<string,any>>();
 for(const row of rows){
  const key=['profile','attempt','session'].includes(row.kind)?recordKey(row):row.id;
  const old=map.get(key);if(!old||row.date>old.date)map.set(key,row);
 }
 return [...map.values()].sort((a,b)=>b.date-a.date);
}

import type {Event} from './catalog.ts';
// One sound may need more than one written figure. Keep its audio index.
export function notationParts(event:Event){
 const values=event.b===2.5?(event.n?[.5,2]:[2,.5]):[event.b];
 return values.map((b,i)=>({event:{...event,b},tieStart:!!event.n&&i<values.length-1,tieStop:!!event.n&&i>0}));
}
export function scoreRows(events:Event[],beatsPerBar=4){
 const rows:{event:Event,index:number,beat:number,tieStart:boolean,tieStop:boolean}[][]=[];
 let beat=0;
 for(const [index,event] of events.entries()){
  if(!rows.length||(beat>0&&beat%(beatsPerBar*2)===0))rows.push([]);
  for(const part of notationParts(event)){
   rows.at(-1)!.push({...part,index,beat});
   beat+=part.event.b;
  }
 }
 return rows;
}

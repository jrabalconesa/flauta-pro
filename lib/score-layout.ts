import type {Event} from './catalog.ts';
export function scoreRows(events:Event[],beatsPerBar=4){
 const rows:{event:Event,index:number,beat:number}[][]=[];
 let beat=0;
 for(const [index,event] of events.entries()){
  if(!rows.length||(beat>0&&beat%(beatsPerBar*2)===0))rows.push([]);
  rows.at(-1)!.push({event,index,beat});
  beat+=event.b;
 }
 return rows;
}

/** Quarter-note pulse shared by reference playback and practice. */
export const secondsPerBeat=(bpm:number,speed:number)=>60/(bpm*speed);
export const holdSeconds=(beats:number,bpm:number,speed:number)=>beats*secondsPerBeat(bpm,speed);
// Low percussive clicks: C5 / A4, two octaves below the previous accent.
export const clickMidi=(beat:number,beatsPerBar:number)=>beat%beatsPerBar===0?72:69;

export const isMetronomeEcho=(midi:number,age:number,beat:number,meter:number)=>age>=0&&age<.2&&Math.abs(midi-clickMidi(beat,meter))<.6;

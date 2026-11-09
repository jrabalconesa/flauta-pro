import {test} from 'node:test';import assert from 'node:assert/strict';import {secondsPerBeat,holdSeconds,clickMidi} from '../lib/practice-timing.ts';
test('SI LA at 80% has 48 BPM and each one-beat note lasts 1.25 seconds',()=>{assert.equal(secondsPerBeat(60,.8),1.25);assert.equal(holdSeconds(1,60,.8),1.25);assert.equal(holdSeconds(2,60,.8),2.5);});
test('clicks remain audible and accent the selected meter',()=>{for(const meter of [2,3,4]){assert.equal(clickMidi(0,meter),72);assert.equal(clickMidi(meter,meter),72);assert.equal(clickMidi(1,meter),69);for(let b=0;b<8;b++){const hz=440*2**((clickMidi(b,meter)-69)/12);assert.ok(hz>=440&&hz<=550);}}});

import {isMetronomeEcho} from '../lib/practice-timing.ts';
import {detectPitch} from '../lib/pitch.ts';
test('click tail in a microphone buffer is ignored without suppressing SI or LA',()=>{
 const rate=48000,N=4096,now=.09;const buf=Float32Array.from({length:N},(_,i)=>{const t=now-(N-i)/rate;if(t<0||t>.045)return 0;const env=t<.001?t/.001:Math.exp(Math.log(.0001/.18)*(t-.001)/.044);return .16*env*(2/Math.PI)*Math.asin(Math.sin(2*Math.PI*523.251*t))});
 const p=detectPitch(buf,rate);assert.ok(p);assert.equal(isMetronomeEcho(p.midi,now,0,4),true);
 for(const midi of [81,83])assert.equal(isMetronomeEcho(midi,now,0,4),false);
 assert.equal(isMetronomeEcho(72,.25,0,4),false);
});

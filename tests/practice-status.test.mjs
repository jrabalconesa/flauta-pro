import {test} from 'node:test';import assert from 'node:assert/strict';
import {practiceStatus} from '../lib/practice-status.ts';import {recommend} from '../lib/catalog.ts';
const a=(date,extra={})=>({exerciseId:'primer-si',mode:'free',reliable:true,completed:true,pitchScore:85,date:Date.parse(date),...extra});
test('three valid attempts on two Madrid dates pass and recommendation advances',()=>{const rows=[a('2026-11-01T12:00Z'),a('2026-11-01T13:00Z'),a('2026-11-02T12:00Z')];assert.equal(practiceStatus(rows,'primer-si').passed,true);assert.equal(recommend(rows).exercise.id,'si-la');});
test('repetitions on one day still need a distinct day',()=>{const s=practiceStatus([a('2026-11-01T12:00Z'),a('2026-11-01T13:00Z'),a('2026-11-01T14:00Z')],'primer-si');assert.equal(s.missingAttempts,0);assert.equal(s.missingDays,1);assert.equal(s.passed,false);});
test('incomplete, unreliable, subthreshold, timed and self attempts cannot inflate counters',()=>{const rows=[{completed:false},{reliable:false},{pitchScore:84},{mode:'timed'},{mode:'self'},{exerciseId:'si-la'}].map(extra=>a('2026-11-01T12:00Z',extra));assert.equal(practiceStatus(rows,'primer-si').validAttempts,0);});
test('calendar days use Madrid timezone',()=>{const s=practiceStatus([a('2026-11-01T22:30Z'),a('2026-11-01T23:30Z'),a('2026-11-02T12:00Z')],'primer-si');assert.equal(s.days,2);assert.equal(s.passed,true);});

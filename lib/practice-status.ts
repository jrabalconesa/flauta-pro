export const PRACTICE_REQUIREMENTS={attempts:3,days:2,score:85} as const;
export function practiceStatus(attempts:any[],exerciseId:string){
 const recorded=attempts.filter(a=>a.exerciseId===exerciseId);
 const valid=recorded.filter(a=>a.mode==='free'&&a.reliable&&a.completed&&Number.isFinite(a.pitchScore)&&a.pitchScore>=PRACTICE_REQUIREMENTS.score&&Number.isFinite(Number(a.date)));
 const days=new Set(valid.map(a=>new Date(a.date).toLocaleDateString('en-CA',{timeZone:'Europe/Madrid'}))).size;
 const last=recorded.filter(a=>a.mode==='free').sort((a,b)=>Number(b.date)-Number(a.date))[0];
 return {validAttempts:valid.length,days,passed:valid.length>=PRACTICE_REQUIREMENTS.attempts&&days>=PRACTICE_REQUIREMENTS.days,missingAttempts:Math.max(0,PRACTICE_REQUIREMENTS.attempts-valid.length),missingDays:Math.max(0,PRACTICE_REQUIREMENTS.days-days),lastScore:last?.reliable&&Number.isFinite(last.pitchScore)?last.pitchScore:null};
}

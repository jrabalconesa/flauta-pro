import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
const manifest=JSON.parse(readFileSync('cancionero-assets.json','utf8'));
const chunks=Object.entries(manifest.parts).map(([file,expected])=>{
 if(!/^chunk\d{3}$/.test(file))throw Error('Unexpected cancionero shard');
 const bytes=readFileSync(join('cancionero-assets',file));
 if(createHash('sha256').update(bytes).digest('hex')!==expected)throw Error('Cancionero shard mismatch: '+file);
 return bytes;
});
const archive=Buffer.concat(chunks);
if(createHash('sha256').update(archive).digest('hex')!==manifest.archive_sha256)throw Error('Cancionero archive mismatch');
const temp=mkdtempSync(join(tmpdir(),'flauta-cancionero-'));
try{
 const file=join(temp,'assets.tar.gz');writeFileSync(file,archive);
 execFileSync('tar',['-xzf',file],{stdio:'inherit'});
}finally{rmSync(temp,{recursive:true,force:true});}
console.log('Restored verified public cancionero: '+manifest.file_count+' files.');

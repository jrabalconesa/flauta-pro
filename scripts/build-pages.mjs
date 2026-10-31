import {execFileSync}from'node:child_process';import fs from'node:fs';
execFileSync(process.execPath,['node_modules/vite/bin/vite.js','build'],{stdio:'inherit'});fs.rmSync('docs',{recursive:true,force:true});fs.cpSync('dist','docs',{recursive:true});fs.writeFileSync('docs/.nojekyll','');

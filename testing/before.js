import { connectionDb } from '../backend/misc/database.js';
import {execFile} from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mochaPath = path.resolve(__dirname.replace('\\testing',''), 'node_modules', '.bin', 'mocha.cmd');

await connectionDb()
 .then((message) => {// console.log(message);
     
        
     const mocha = execFile(mochaPath, ['./testing/','--color', '--timeout 7000', '--ui', 'tdd']); 

     
    mocha.stdout.on('data', (data) => { console.log(`${data}`); return }); 
     
     mocha.stderr.on('data', (data) => { console.error(`${data}`); });
    mocha.on('close', (code) => { console.log(`Exit with code ${code}`);process.exit(0) });
     return
        }) 
 .catch((error) => { console.error("Connection database failed, impossible executed test",error); process.exit(1)}) // Esci con un codice di errore });
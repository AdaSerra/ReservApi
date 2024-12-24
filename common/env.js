import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

export default function env()  {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const envPath = path.resolve(__dirname.replace('\\common',''), '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    
    
    envContent.split('\n').forEach(line => {
      const ix =line.indexOf('=')
      const key = line.slice(0,ix)
      const value=line.slice(ix+2).replaceAll("'","")
      if (key && value) {
       
        process.env[key.trim()] = value.trim();
      }
    });
   
}





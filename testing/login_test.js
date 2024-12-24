import Mocha from 'mocha'
import chai from 'chai';
import chaiHttp from 'chai-http';
import {app} from '../backend/server.js'
import env from '../common/env.js'
import { connectionDb } from '../backend/misc/database.js';
env()

chai.use(chaiHttp)

const { suite, test} = Mocha; 
const { assert,expect } = chai;

let cookie =''
//testing from an IP in mongodb whitelist

await connectionDb()
.then(()=>{
suite("Test login",()=>{
  
    

    
    test("Login with uncorrect credentials",async()=>{
        try {
            const res =await chai.request(app)
            .post('/login')
            .send({username:'USERNAME',
                    password:'PASSWORD'
            })
            assert.strictEqual(res.status,401,'Status code would be 401')
            assert.deepEqual(res.body,{error:"Wrong credentials"},'Message would be indicates wrong input');
            
       }
            catch (err) { console.error('Error:', err); throw err }
         
        
    })
    test("Login with right credentials",async ()=>{
      try {
            const res =await chai.request(app)
            .post('/login')
            .redirects(0) //noredirect to mantains statuscode=302
            .send({username:process.env.USER,
                    password:process.env.TESTING
            })
            assert.strictEqual(res.status,302,'Status code would be 302')
            expect(res.redirect).to.be.true
            expect(res).to.redirectTo(/\/admin$/,'Redirect would be /admin')
            assert.strictEqual(res.header.location,'/admin')
            
            expect(res).to.have.header('set-cookie',/connect.sid+/)
            
            cookie=res.headers['set-cookie'][0] //set cookie for next requests
          
            const ix=cookie.indexOf(';')
            cookie=cookie.slice(0,ix)
          
           
        }
       catch(err) {console.error('Error: ',err);throw err}
       
        
        
    })
})

suite("Test Admin",()=>{
    test("GET admin pages with wrong cookie", async ()=>{
        try {
            const res =await chai.request(app)
            .get('/admin')
            .redirects(0) //noredirect to mantais statuscode=302
            .set("Cookie","wrongstring")
            assert.strictEqual(res.status,302,'Status code would be 302')
            expect(res).to.redirectTo(/\/login$/,'Redirect would be /login')
            
        }
       catch(err) {console.error('Error: ',err);throw err}
    })
    test("GET admin with right cookie", async ()=>{
        try {
            const res =await chai.request(app)
            .get('/admin')
            .redirects(0)
            .set("Cookie",cookie)
            assert.strictEqual(res.status,200,'Status code would be 200')
            assert.include(res.text,'window.__INITIAL_DATA__','Document would have an object with all records')
            const result=JSON.parse(res.text.slice(res.text.indexOf('['),res.text.lastIndexOf("]")+1))
            expect(result).to.be.an('array','This object would be an array')
           
       }
       catch(err) {console.error('Error: ',err);throw err}
    })
   
})
    
})
.catch((err)=>{console.log("Connection database failed, impossible executed test");process.exitCode=1})


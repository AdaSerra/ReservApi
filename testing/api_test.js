import Mocha from 'mocha'
import chai from 'chai';
import chaiHttp from 'chai-http';
import {app} from '../backend/server.js'
import { connectionDb } from '../backend/misc/database.js';


chai.use(chaiHttp)

const { suite, test} = Mocha; 
const { assert,expect } = chai;

function randomDate(min, max) { 
    return Math.floor(Math.random() * (max - min + 1)) + min; }

const TestingRecord = {
    name:"TEST",
    phone:"1234567890",
    time:`20${randomDate(26,99)}-0${randomDate(1,9)}-${randomDate(1,28)}T1${randomDate(0,7)}:00:00%2B01:00`
}



await connectionDb()
.then(()=>{
    suite("POST method",()=>{
        test("Create a correct Reservation",async()=>{
            try{
                const res =await chai.request(app)
                .post(`/api?name=${TestingRecord.name}&phone=${TestingRecord.phone}&time=${TestingRecord.time}`)
                
                assert.strictEqual(res.status,201)
                assert.include(res.body.message,TestingRecord.name)
                assert.include(res.body.message,TestingRecord.time.slice(0,4))
                
                
                TestingRecord.id=res.body.info._id
               
            }
            catch(err){console.error('Error:', err); throw err}
        })
    })
   
    suite("GET method", ()=>{
        test("Test without id",async()=>{
            try{
                const res =await chai.request(app)
                .get("/api")
                assert.strictEqual(res.status,400)
                assert.deepEqual(res.body,{error:"Missing id"});
            }
            catch(err){console.error('Error:', err); throw err}
        })
        test("Test invalid id",async()=>{
            try{
                const res =await chai.request(app)
                .get("/api?id=wrongstring")
                assert.strictEqual(res.status,500)
                assert.deepEqual(res.body,{error:"Invalid id"});
            }
            catch(err){console.error('Error:', err); throw err}
        })
        test("Test not found record",async()=>{
            try{
                const res =await chai.request(app)
                .get("/api?id=67641d5f288d4d0072a06cf6")
                assert.strictEqual(res.status,404)
                assert.deepEqual(res.body,{error:"Reservation not found"});
            }
            catch(err){console.error('Error:', err); throw err}
        })
    })
})
.catch((err)=>{console.log("Connection database failed, impossible executed test");process.exitCode=1})



import {MongoClient,ObjectId} from 'mongodb'
import {optionsDate} from '../../common/time.js'
import env from '../../common/env.js'
env()


const uri= process.env.MONGO_URI;
const dbName = 'test';
const client = new MongoClient(uri)


async function tryConnect() {
    try {
        await client.connect();
            
    }
    catch (error) { console.error('Connection to MongoDb failed, error:', error); } 
    finally { await client.close() } 
}


async function Reservs(method, arg,res) { 
    try { 
        await client.connect(); 
        console.log("Connesso a MongoDb"); 
        const db = client.db(dbName); 
        const collection = db.collection('reservations'); 
        let query
        let result
        switch (method) { 

            case 'GETALL':
               return await collection.find({}).toArray()
               
            case 'GET': 
            if (!ObjectId.isValid(arg)) { 
                return res.status(500).json({error:"Invalid id"})}
              
             query = { _id: new ObjectId(arg) };
            
            result = await collection.findOne(query)
            return result ? res.json(result) : res.status(404).json({error:"Reservation not found"})

            case 'PUT':
               
                if (!ObjectId.isValid(arg.id)) { 
                    return res.status(500).json({error:"Invalid id"})}
             query = { _id: new ObjectId(arg.id) };
            const update = {...arg};
            delete update.id
            result = await collection.findOne(query)
            if(!result) {res.status(404).json({message:"Reservation not found"})}
            result = await collection.updateOne(query,{$set:update})
       
            return result.modifiedCount >0? res.json({message:`Reservation ${arg.id} successfully update`}) : res.status(500).json({error:`Reservation ${arg.id} not update`});
            
            case 'POST':
                query = {date:arg.date}
                result = await collection.findOne(query)
                if (result) {
                    return res.status(400).json({message:"Date busy"})
                }
                else {
                    const newRes = await collection.insertOne(arg)
                   const formattedDate =arg.date.toLocaleDateString('en-US',optionsDate)
                    
                    return res.status(201).json({message:`Reservation for ${arg.name} confirmed at ${formattedDate}`,info:newRes.insertedId})   
                }

            case 'DELETE':
                if (!ObjectId.isValid(arg)) { 
                    return res.status(500).json({error:"Invalid id"})}
                 query = { _id: new ObjectId(arg) };
                 result = await collection.deleteOne(query);
                 return result.deletedCount >0 ? res.json({message:`Reservation ${arg} successfully delete`}): res.status(404).json({message:`Reservation ${id} not delete`})
                
            default: return null; } } 
    catch (error) { console.error('Connection to MongoDb failed, error: ', error); res.status(500).send("Server issue, try later")   } 
    finally { await client.close(); console.log("Connessione chiusa"); } }




export {Reservs,tryConnect}

import {mongoose} from 'mongoose';
import env from '../../common/env.js'
env()

const connectionDb= async ()=> mongoose.connect(process.env.MONGO_URI);


const handleConnectionEvents = (control) => { 
    mongoose.connection.on('connected', () => { 
        control=true
        console.log('Connessione a MongoDB stabilita'); }); 
    mongoose.connection.on('error', (err) => { 
         control=false
        console.error('Errore di selezione del server MongoDB:', err.message)}); 
        
            
    mongoose.connection.on('disconnected', () => { 
        control =false
        console.log('Connessione a MongoDB interrotta'); }); };

const ReservSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
       
    },
    phone:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true,
        unique:true
    }

},{versionKey:false})

const Reserv = mongoose.model('Reservation',ReservSchema)


export {Reserv,connectionDb,handleConnectionEvents}

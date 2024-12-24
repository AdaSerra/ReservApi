import {Reserv} from './database.js'
import {phoneControl,nameControl,dateControl} from '../../common/controller.js';
import {optionsDate} from '../../common/time.js'
import {isAuthenticated } from './middlewares.js';
import env from '../../common/env.js'
env()
import bcrypt from'bcryptjs';

export default function appRoutes(app) {
    app.route('/')
    .get( function (req, res) {
      res.render('index');
    })

    app.route('/api')
      .get(async function(req,res) {
        const id=req.query.id
        if(!id) {res.status(400).json({error:"Missing id"})}
        else {
          try {
              const findRes= await Reserv.findById(id)
              if(findRes)
              {res.json(findRes)}
              else {res.status(404).json({error:"Reservation not found"})}
          }
          catch(err) {console.error("Error: ",err);res.status(500).json({error:"Invalid id"})}
        }
      })
      .post(async function (req,res) {
   
        const {name,phone,time} =req.query
        const date= new Date(time)
        
        if (!name || !phone || !time)
       {return res.status(400).json({message:"Required field(s) missing"})} 

        else if(!nameControl(name)) {res.status(400).json({message:"Invalid name"})}
        else if (!phoneControl(phone)) {res.status(400).json({message:"Invalid phone number"})}
        else if (dateControl(date)) {res.status(400).json({message:"Invalid date"})}
        else {
            try {
              const findRes= await Reserv.findOne({date:date})
              if(findRes) {res.status(400).json({message:"Date busy"})}
              else {
                const newRes = new Reserv({
                  name:name,
                  phone:phone,
                  date:date
                });
                const saveRes = await newRes.save();
    
                const formattedDate = saveRes.date.toLocaleDateString('en-US',optionsDate)
                //const formattedTime= saveRes.date.toLocaleTimeString('en-US',optionsDate)
                return res.status(201).json({message:`Reservation for ${saveRes.name} confirmed at ${formattedDate}`,info:saveRes})         
    
              }
            }
            catch (err) {res.status(500).json({error:err})}
        }
      })
      .put(async function(req,res) {
        const id=req.query.id
        const {name,phone,time} =req.query
        const date=new Date(time)
    
        if (!id) {res.status(400).json({error:"Missing Id"})}
        else if(!name && !phone && !time) {res.status(400).json({message:"Required field(s) missing"})}

        else if(!nameControl(name)) {res.status(400).json({message:"Invalid name"})}
        else if (!phoneControl(phone)) {res.status(400).json({message:"Invalid phone number"})}
        else if (dateControl(date)) {res.status(400).json({message:"Invalid date"})}
        else{
          try{
          const update = {
            name:name,
            phone:phone,
            date:date
          }
        const findUpd = await Reserv.findByIdAndUpdate(id,update)
         if(findUpd) {return res.json({message:`Reservation ${id} successfully update`})}
          else {return res.status(404).json({message:"Reservation not found"})}
        }
          catch(err) {return res.status(500).json({message:err})}
       }
      })
      .delete(async function(req,res) {
        const id=req.query.id
        if (!id) {res.status(400).json({error:"Missing Id"})}
        try {
            const findDelete= await Reserv.findByIdAndDelete(id);
            if(findDelete) {return res.json({message:`Reservation ${id} successfully delete`})}
            else {return res.status(404).json({message:`Reservation ${id} not delete`})}
        }
       catch (err) {
        return res.status(500).json({message:err})
       }
      })
    
      app.route('/admin')
        
        .get(isAuthenticated,async function (req,res) {
             
              const result = await Reserv.find({})
             res.render('admin',{ result: JSON.stringify(result) })
              
        })

      app.route('/login')
        .get(function (req,res) {
          res.render('login')
        })
        .post(async function (req, res) { 
          const { username, password } = req.body; 
          
          if (process.env.USER ===username && await bcrypt.compare(password,process.env.PASSWORD) ) { 
             req.session.user = username;
             
            return  res.redirect(`/admin`) 
            }
           
         else { 
         
          res.status(401).json({error:"Wrong credentials"}); } 
        });

      app.route('/logout')
          .get(function (req,res) {
            req.session.destroy((err) => {
              if (err) {res.status(500).json({error:err})}
              else {res.redirect('login')}
            })
          })
      
    
}


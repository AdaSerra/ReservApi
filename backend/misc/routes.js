import {Reservs} from './database.js'
import {phoneControl,nameControl,dateControl} from '../../common/controller.js';
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
              
              Reservs('GET',id,res)
  
          }
          catch(err) {
            console.error("Error: ",err);res.status(500).json({error:"Invalid id"})}
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
              const newRes={
                name:name,
                phone:phone,
                date:date
              }
              Reservs('POST',newRes,res)
          
              
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
          const arg = {
            name:name,
            phone:phone,
            date:date,
            id:id
          }
          Reservs('PUT',arg,res)

        }
          catch(err) {return res.status(500).json({message:err})}
       }
      })
      .delete(async function(req,res) {
        const id=req.query.id
        if (!id) {res.status(400).json({error:"Missing Id"})}
        try {
            Reservs('DELETE',id,res)
        }
       catch (err) {
        return res.status(500).json({message:err})
       }
      })
    
      app.route('/admin')
        
        .get(isAuthenticated,async function (req,res) {
             
              const result = await Reservs('GETALL',null,null)
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


import {connectionDb} from './database.js'

async function middleConnectionDb (req, res, next) { 
    try { 
     await connectionDb()
     next(); } 

    catch (error) { 
      console.error("Error: ",error);
      return res.status(500).send("Server issue, try later")    
     } };
  
function isAuthenticated(req, res, next) { 
    if (req.session.user) { 
      
      return next(); }   
    else { 
      
      res.redirect('/login'); }};
  
function reqInfo(req, res, next) {
    let statusCode = ''
    console.log(`Request: ${req.method} ${req.url} ${req.protocol} from: ${req.ip || req.connection.remoteAddress}`)
    console.log(`         Query: ${JSON.stringify(req.query)} Body: ${JSON.stringify(req.body)}`)
    console.log(`         Cookie: ${req.get('Cookie')}`)
    console.log(`         User Agent: ${req.get('User-Agent')}`)

    const originalSend = res.send; 
   
    res.send = function (body) { 
      statusCode+= res.statusCode >=400 ? `\x1b[31m${res.statusCode }\x1b[0m` : `\x1b[32m${res.statusCode }\x1b[0m`; 
      console.log(`Response: ${statusCode}`)
       
      originalSend.call(this, body); 
     
    };
    /*
     const originalRedirect = res.redirect; 
    res.redirect = function (url) { 
      if (req.method ==='POST' && req.path === '/login') {
        if (url === '/admin') { 
          statusCode =statusCode + " \x1b[32mLOGIN SUCCESS\x1b[0m" ;
         
          originalRedirect.call(this, url); 
        }
        else {
            statusCode =statusCode + " \x1b[31mLOGIN FAILED\x1b[0m";
            originalRedirect.call(this, url); 
        }
      }
     else { originalRedirect.call(this, url); }
     console.log(`Response: ${statusCode}`)
    } 
    */
      
     
     next()

   
  }

function sessionSt (res,req,next,sessionStore) {
    sessionStore.all((err, sessions) => { 
      if (err) { console.error(err) } 
      console.log(JSON.stringify(sessions)) });
      next()
  }

  export {middleConnectionDb,reqInfo,isAuthenticated}
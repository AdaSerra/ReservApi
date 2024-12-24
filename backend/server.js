import express from'express';
import bodyParser from'body-parser';
import { reqInfo, middleConnectionDb } from './misc/middlewares.js';
import session from'express-session';
import appRoutes from './misc/routes.js';
import env from '../common/env.js'
env()


const sessionStore = new session.MemoryStore() //only if there few users
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
  store:sessionStore,
  secret: process.env.SECRET_KEY, 
  resave: false, 
  saveUninitialized: true,
  cookie:{secure:false,  //secure true only for https
          
  } })); 
app.set('view engine', 'ejs');
app.set('views', process.cwd()+'/frontend/views');
app.use('/public', express.static(process.cwd() + '/frontend/dist'));
app.use(middleConnectionDb)

process.argv[2] === 'use' ? app.use(reqInfo) : null




const portNum = 3000;


  
//routes
appRoutes(app)


 

// Listening
app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
 
});

export {app}
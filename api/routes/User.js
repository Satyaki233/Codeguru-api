const express= require('express');
const router = express.Router();
const bodyParser =require('body-parser');
const cors = require('cors')
const app =express();
const bcrypt = require('bcryptjs');
const fs =require('fs');
require('dotenv').config()
const knex =require('knex')({
	client: 'pg',
	version: '7.2',
	connection: {
        host :process.env.HOST,
        user : process.env.USER,
        password :process.env.PASS,
        database :process.env.NAME
	}
  });
  


app.use(bodyParser.json());
app.use(cors());

router.post('/login',(req,res)=>{

    // console.log(req.body.email);
    knex.select('email','password').from('users')
    .where('email','=' , req.body.email)
    .then(data =>{
        const isValid= bcrypt.compareSync(req.body.password, data[0].password)
        if(isValid){
            knex.select('*').from('register')
            .where('email','=',req.body.email)
            .then(user =>{
                res.json(user[0]);
                
            } )
            .catch(err => res.status(400).json('Not found'));
        }
    })
})




router.post('/register',(req,res,next)=>{
    
        const {username , email ,password }= req.body;
        const hash = bcrypt.hashSync(password);
        knex.transaction(trx =>{
            trx.insert({
               email : email,
              password : hash
            })
            .into('users')
            .returning('email')
            .then(loginEmail =>{
              return trx('register')
                .returning('*')
                .insert({
                    username :username,
                    email: loginEmail[0],				
                    
                }).then(user =>{
                    res.json(user[0]);
                })
            }).then(trx.commit)
            .catch(trx.rollback)
        })
        
        .catch(err =>{
            res.send(err);
        })
    
})





module.exports = router;






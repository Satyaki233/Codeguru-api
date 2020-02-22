const express= require('express');
const router = express.Router();
const bodyParser =require('body-parser');
const cors = require('cors')
const app =express();
const bcrypt = require('bcryptjs');
const fs =require('fs');
require('dotenv').config()
const Joi = require('@hapi/joi')
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
        }else{
            res.status(400).json('wrong password')
        }
    })
    .catch(err => { res.status(400).json('unable to Login')})
})


////Validation....................

const schema = Joi.object().keys({
    username:Joi.string().min(4).required(),
    email:Joi.string().min(6).required().email(),
    password:Joi.string().min(4).required()
});

router.post('/register',(req,res,next)=>{
        
    const {error}=schema.validate(req.body)
    

   if(error) return( 
      
       res.status(400).json('valid error'))
    else{
        const {username , email ,password }= req.body;
  knex.raw('select * from users where email=?',email)
  .then(data=>{
      res.json('email already exist')
  })
  .catch(err=>{
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
    }
   
 
 
})

router.get('/',(req,res)=>{
    knex.raw('select * from register')
    .then(data=>{
        res.status(200).json(data.rows)
    }).catch(err =>{
        res.json(err);
    })
})





module.exports = router;






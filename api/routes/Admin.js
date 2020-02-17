const express = require('express');
const router = express.Router();
require('dotenv').config();
const bcrypt = require('bcryptjs');


const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: {
      host :process.env.HOST,
      user : process.env.USER,
      password :process.env.PASS,
      database :process.env.NAME
    }
  });


router.post('/',(req,res)=>{
	const { username , email , password } = req.body;
	const hash = bcrypt.hashSync(password);

   
     knex.raw('select * from admin where email=?',email)
     .then(data =>{
     	// res.json(data.rows[0].email)
     	if(data.rows[0].email){
     		res.send('same email')
     	}})
     .catch(err =>{
     	// res.json('not smae')
     				knex('admin')
								  .returning('email')								  
								  .insert({
								    username : username,
								    email : email,
								    password: hash,
								    joined : new Date()

							  }).then( data => {
							  	res.status(200).json(data)
							  })
							  .catch( err =>{
							  	res.status(400).json(err)
							  })

     })

   })

router.post('/Login/:password',(req,res)=>{
    const { password }= req.params;
    const { email , username }=req.body;
    knex('admin').select('*').where('email',email)
    .then(data =>{
      const isValid= bcrypt.compareSync(password, data[0].password)
          if(isValid){
            knex('admin').select('email').where('email',email)
            .then(data=>{
              res.json(data)
            })
            .catch(err =>{
              res.json(err)
            })
          }else{
            res.json('wrong password')
          }

    })
    .catch(err =>{
      res.json('Wrong email is given');
    })
})


 module.exports = router;
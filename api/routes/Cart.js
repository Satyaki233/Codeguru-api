<<<<<<< HEAD
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

router.post('/:courseid',(req,res)=>{
  
  knex('cart').select('*').where({
  courseid: req.params.courseid,
  userid: req.body.userid
})
  .then(data =>{
    
    if(data[0].courseid){
      res.json('already carted')
    }
   })
  .catch(err =>{
          knex('cart')
        .returning('*')
        .insert({
          courseid: req.params.courseid,
          userid: req.body.userid
        })
        .then( data =>{
          res.status(200).json(data);
        })
        .catch(err =>{
          res.json(err);
        })
      })
  })




router.post('/',(req,res)=>{

    const { userid, cousreid , cartid } = req.body;

	knex.select('*')
	.from('cart')
	.fullOuterJoin('course', 'cart.courseid', 'course.id')
	.where('userid',userid)
	.then(data =>{
		res.json(data)
	})
})

  router.post('/delete/:courseid',(req,res)=>{
    var i=0;
    const {userid }= req.body;
    const {courseid}=req.params;    

     knex('cart')
     .where({
    courseid :courseid,
    userid: userid
       
    })
    .del()
    .returning('*')
   .then(data=>{
    res.json('deleted')
   })
   .catch(err=>{
    res.json(err)
   })

    
  })





=======
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

router.post('/:courseid',(req,res)=>{
  
  knex('cart').select('*').where({
  courseid: req.params.courseid,
  userid: req.body.userid
})
  .then(data =>{
    
    if(data[0].courseid){
      res.json('already carted')
    }
   })
  .catch(err =>{
          knex('cart')
        .returning('*')
        .insert({
          courseid: req.params.courseid,
          userid: req.body.userid
        })
        .then( data =>{
          res.status(200).json(data);
        })
        .catch(err =>{
          res.json(err);
        })
      })
  })




router.post('/',(req,res)=>{

    const { userid, cousreid , cartid } = req.body;

	knex.select('*')
	.from('cart')
	.fullOuterJoin('course', 'cart.courseid', 'course.id')
	.where('userid',userid)
	.then(data =>{
		res.json(data)
	})


})


>>>>>>> 3fad7be811381f24f589af3cf7ecb2a081a3d180
module.exports = router;
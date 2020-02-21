
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
          userid: req.body.userid,
          buy: 0
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
	.where({
    userid: userid,
    buy: 0
  })
	.then(data =>{
		res.json(data)
	}).catch(err=>{
    res.json(err)
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

  router.get('/Buy/:userid',(req,res)=>{
       const {userid}=req.params;
       knex('cart')
       .returning('*')
       .fullOuterJoin('course', 'cart.courseid', 'course.id')
       .where({
         userid:userid,
         buy:1
       })
       .then(data =>{
         res.status(200).json(data)
       })
       .catch(err=>{
         res.status(400).json(err)
       })
  })

  router.get('/Buy',(req,res)=>{
    const {userid}=req.params;
    knex('cart')
    .returning('*')
    .fullOuterJoin('course', 'cart.courseid', 'course.id')
    .where({
      
      buy:1
    })
    .then(data =>{
      res.status(200).json(data)
    })
    .catch(err=>{
      res.status(400).json(err)
    })
})


  router.post('/emptyCart/:userid',(req,res)=>{
    var i=0;
    const {userid }= req.params;
    // const {courseid}=req.params;    

     knex('cart')
     .where({
   
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

  router.post('/Checkout/:userid',(req,res)=>{
    var i=0;
    const {userid }= req.params;
    // const {courseid}=req.params;    

     knex('cart')
     .where({
   
    userid: userid
       
    })
    .update({
      buy : 1
    })
    .returning('*')
   .then(data=>{
    res.json(data)
   })
   .catch(err=>{
    res.status(400).json(err)
   })

    
  })








module.exports = router;
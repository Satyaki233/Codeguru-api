
const express = require('express');
const router = express.Router();
require('dotenv').config();
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

router.get('/',(req,res)=>{
    knex.raw('select * from feeds order by id DESC')
    .then(data=>{
        res.json(data.rows)
    })
    .catch(err=>{
        res.json('err')
    })
})

router.post('/:userid',(req,res)=>{
    knex('feeds')
    .returning('*')
    .insert({
        username:req.body.username,
        email:req.body.email,
        feeds: req.body.feeds,
        joined: new Date()
    })
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.json(err)
    })
})





module.exports = router;



const express = require('express');
const bodyParser= require('body-parser');
const pg = require('pg')
const morgan=require('morgan');
const cors = require('cors');

//middle ware.............
const app = express();
const course = require('./api/routes/Course');
const User = require('./api/routes/User');

require('dotenv').config();
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'));
app.use(morgan('dev'));

//connecting DATABASE....
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

 



//CREATE TABLES IN DATABASE..........................

//1 Course database
knex.schema.hasTable('course').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('course', function(t) {
        t.increments('id').primary();
        t.string('title', 100);
        t.string('intro', 100);
        t.string('image', 255);
        t.text('describtion');
      });
    }
  });

  // 2 register..............
  knex.schema.hasTable('register').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('register', function(t) {
        t.increments('id').primary();
        t.string('username', 30);
        t.string('email', 50);
        t.timestamp('joined').defaultTo(knex.fn.now());
      });
    }
  });

  //3 Login table ..................
  knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('users', function(t) {
        t.increments('id').primary();
        t.string('email', 50);
        t.string('password',255);
       
      });
    }
  });


  



app.use('/course',course);
app.use('/User',User);

app.listen(process.env.PORT ,()=>{
    
 console.log(`Server is running on the PORT = ${process.env.PORT}`);
 })

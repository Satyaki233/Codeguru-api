const express = require('express');
const router = express.Router();
require('dotenv').config();
var multer  = require('multer')
const fs =require('fs');

  

const storeage = multer.diskStorage({
  destination: function (req,file,cb) {
    cb(null,'./uploads/');
  },
  filename: function (req,file,cb) {
    cb(null,file.originalname);
  }
}) ;

const fileFilter =(req,file,cb)=>{
  if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
    cb(null,true);
  }
  else{
    cb(null,false);
  }
}
const  upload = multer({ 
   storage:storeage,
   limits : {
  fieldSize: 1024 * 1024 * 5
},
  fileFilter: fileFilter
});



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



 

router.get('/',(req,res,next)=>{
  knex.raw('select * from course order by id desc')
  .then(data =>{
       res.json(data.rows);

  });
       
})

router.get('/:id',(req,res)=>{
   
   console.log(req.params.id);
   knex.raw('select * from course where id = ?',req.params.id)
     .then(data =>{
       res.json(data.rows);
     })
})


router.post('/',upload.single('image'),(req,res,next)=>{
  console.log(req.file);
   const {title ,intro ,price ,describtion }= req.body;
   console.log( title);  
   knex('course').returning('*').insert({
       title:title,
       intro: intro,
       image:req.file.path,
       price: price,
       describtion: describtion
   }).then(response =>{
       res.json(response);
   }).catch(err=>{
    res.json(err)
   })
   
})

router.delete('/:id',(req,res,next)=>{
    
  console.log(req.params.id);
  knex.select('*').from('course').where('id','=',req.params.id).then(data =>{
  
    console.log('data');
   if(data.length == 0){
     res.json('no such file exists');
   }else{
    fs.unlink(data[0].image, function (err) {
      if(err){
        console.log(err)
      }
      console.log('File deleted!');
    })
    console.log(data[0].id)
    knex.raw("delete from course where id =?",data[0].id).then( response =>{
        res.json({message :" file has been deleted"});
    }).catch(err =>{
        res.json(err);
    })
   }    
  
})
})


router.put('/:id',upload.single('image'),(req,res)=>{
  const id = req.params.id;
  const {title ,intro ,describtion }= req.body;
  knex('course').where({ id : id}).returning('*')
  .update({
    title:title,
    intro: intro,
    image:req.file.path,
    describtion: describtion
  }).then(response =>{
    res.status(200).json(response);
  }).catch( err =>{
    res.json(err);
  })
})

module.exports = router;
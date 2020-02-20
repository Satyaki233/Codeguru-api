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


  var braintree = require("braintree");

 var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId:process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey:process.env.BRAINTREE_PRIVET_KEY
});

  router.get('/getToken/:userid',(req,res)=>{
      console.log(req.params.userid)
      knex.raw("select * from users where id=?",req.params.userid)
      .then(data=>{
          if(data.rows[0].id)
       { gateway.clientToken.generate({}, function (err, response) {
            if(err){
                res.json(err)
            }else{
                res.status(200).json(response.clientToken)
            }
           });}
       
      }
      )
      .catch(err=>{
          res.status(400).json('user doesnt exits')
      })
   
  })


  router.post('/paymentProcess/:userid',(req,res)=>{
       let nonceFromClient = req.body.paymentMethodNonce;
       let amountFromClient = req.body.amount;

      let newTansaction= gateway.transaction.sale({
        amount: amountFromClient,
        paymentMethodNonce: nonceFromClient,
        
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
        if(err){
          res.status(500).json(err)
        }else{
          res.status(200).json(result)
        }
      });
  })



module.exports = router;
const express = require('express');
const router = express.Router();
const productModel=require('../../model/product')
const passport = require('../../services/passport');


const isauthenticate=passport.authenticate('jwt', { session: false });
/* GET home page. */
router.get('/public', (req, res, next) => {
  res.json('Public cat for everyone!');
});
router.post('/product',isauthenticate, async(req,res,next)=>{
  const type=req.body.type;
  console.log(type);
  const result=await productModel.allProduct(type);
  res.json(result)
})
router.post('/detailproduct',isauthenticate,async(req,res,next)=>{
  const id=req.body.id;
  console.log(req.body);
  const result=await productModel.detailProduct(id);
  res.json(result[0]);
})

module.exports = router;

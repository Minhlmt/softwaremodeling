const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel=require('../../model/user')

const passport = require('../../services/passport');

const router = express.Router();

router.post('/login', passport.authenticate('local', { session: false }), async(req, res, next) => {
  // Passport store user info in req.user
  const user = await req.user;
  console.log(user);
  // Generate jwt token for user, you can also add more data to sign, such as: role, birthday...
  const token =await jwt.sign(user, process.env.JWT_SECRET
    // ,{expiresIn:process.env.tokenLife | 0} //set time token 's live
    );
  
  await res.json({user, token});
});

router.post('/signup', async(req, res, next) => {
 console.log(req.body);
 const N = 5;
  const hash = bcrypt.hashSync(req.body.Pass, N);
 const entity = req.body;
 entity.Pass=hash;
 console.log(entity);
 const result=await userModel.adduser(entity);
 const res_add=await userModel.loadUserbyUsername(req.body.User);
console.log(res_add);
const user=res_add[0];
  const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET
    // ,{expiresIn:process.env.tokenLife | 0} //set time token 's live
    );
  console.log(token);
  res.json({user, token});
});

module.exports = router;

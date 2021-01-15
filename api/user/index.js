const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel=require('../../model/user')
const {OAuth2Client}=require('google-auth-library');
const fetch = require('node-fetch');
const passport = require('../../services/passport');
const { response } = require('express');
const { del } = require('../../utils/db');
 
const client=new OAuth2Client("858381752371-ifk7u4peaeorrp3s45pagkt5psdsdhp1.apps.googleusercontent.com");
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
  const hash = bcrypt.hashSync(req.body.Password, N);
 const entity = req.body;
 entity.Password=hash;
 console.log(entity);
 const result=await userModel.adduser(entity);
 const res_add=await userModel.loadUserbyUsername(req.body.Username);
console.log(res_add);
const user=res_add[0];
  const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET
    // ,{expiresIn:process.env.tokenLife | 0} //set time token 's live
    );
  console.log(token);
  res.json({user, token});
});


module.exports = router;

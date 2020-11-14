const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel=require('../../model/user')
const {OAuth2Client}=require('google-auth-library');
const fetch = require('node-fetch');
const passport = require('../../services/passport');
const { response } = require('express');
const { del } = require('../../utils/db');
 
const client=new OAuth2Client("997832821745-tbin94gpcgvhkk9ek2fvkhg009e4f26p.apps.googleusercontent.com");
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
router.post("/googlelogin",async(req, res, next)=>{
  // console.log(req.body);
  const {tokenId}=req.body;
   const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: "997832821745-tbin94gpcgvhkk9ek2fvkhg009e4f26p.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  }).then(async response=>{
    const {email_verified,name,sub}=response.payload;
    if(email_verified){
      const userbyusername=await userModel.loadUserbyUsername(sub);
      console.log("ok");
      console.log(userbyusername[0]);
      if(userbyusername[0]===undefined){
        const entity=req.body;
        entity.Name=name;
        entity.Pass=1
        entity.User=sub;
        delete entity.tokenId;
        await userModel.adduser(entity);
        const res_add=await userModel.loadUserbyUsername(sub);
        const user=res_add[0];
          const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET
            // ,{expiresIn:process.env.tokenLife | 0} //set time token 's live
            );
          console.log(token);
          res.json({user, token});
      }
      else{
        const user=userbyusername[0];
            const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET
              // ,{expiresIn:process.env.tokenLife | 0} //set time token 's live
              );
            console.log(token);
            res.json({user, token});
      }
    }
    // console.log(response.payload) ;
  });
  
});
router.post("/facebooklogin",async(req, res, next)=>{
  const {accessToken,userID}=req.body;
  let urlGraphFaceboook=`https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`
  fetch(urlGraphFaceboook,{
    method:"GET"
  })
  .then(res=>res.json())
  .then( async response=>{
    const userbyusername=await userModel.loadUserbyUsername(response.id);
    if(userbyusername[0]===undefined){
      const entity=req.body;
      entity.Name=response.name;
      entity.Pass=1
      entity.User=response.id;
      delete entity.accessToken;
      delete entity.userID;
      await userModel.adduser(entity);
      const res_add=await userModel.loadUserbyUsername(response.id);
      const user=res_add[0];
        const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET
          // ,{expiresIn:process.env.tokenLife | 0} //set time token 's live
          );
        console.log(token);
        res.json({user, token});
    }
    else{
      const user=userbyusername[0];
          const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET
            // ,{expiresIn:process.env.tokenLife | 0} //set time token 's live
            );
          console.log(token);
          res.json({user, token});
    }
  })
  
});

module.exports = router;

const express = require('express');
const router = express.Router();
const boardModel=require("../../model/board");
const passport = require('../../services/passport');
const taskModel=require('../../model/task')
const userModel=require('../../model/user')

const isauthenticate=passport.authenticate('jwt', { session: false });
/* GET home page. */
router.get('/public', (req, res, next) => {
  res.json('Public cat for everyone!');
});


router.post("/googlelogin",(req, res, next)=>{
  console.log(req.body);
  // const {tokenId}=req.body;
  //  const ticket = await client.verifyIdToken({
  //     idToken: token,
  //     audience: "997832821745-tbin94gpcgvhkk9ek2fvkhg009e4f26p.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
  //     // Or, if multiple clients access the backend:
  //     //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  // }).then(response=>{
  //   response.payload
  // });
  // console.log(ticket.payload);
})




router.post('/private',isauthenticate,
(req, res, next) => {
  // 
  res.json("ok con de");
  // console.log(req.body);
})
router.get('/:id',isauthenticate, async(req, res,next) => {
  const user = await boardModel.single(req.params.id);
  res.json(user);
});

router.get('/:id/well', isauthenticate,async(req, res) => {
  const user = await taskModel.loadWell(req.params.id);
  res.json(user);
  // res.render('index', { title: 'Express' });
});
router.get('/:id/improve',isauthenticate, async(req, res) => {
  const user = await taskModel.loadImprove(req.params.id);
  res.json(user);
  // res.render('index', { title: 'Express' });
});
router.get('/:id/action',isauthenticate, async(req, res) => {
  const user = await taskModel.loadAction(req.params.id);
  res.json(user);
  // res.render('index', { title: 'Express' });
});
router.post('/:idtype/:idboard',isauthenticate, async(req, res) => {
 const entity=req.body;
 entity.Type=req.params.idtype;
 entity.IDboard=req.params.idboard;
 const result=await taskModel.add(entity);
 res.json("complete");
//  console.log(entity);
});
router.get('/:id/deletetask',isauthenticate, async(req, res) => {
  await taskModel.del(req.params.id);
  res.json("conplete");

});
router.get('/:id/deletealltask',isauthenticate, async(req, res) => {
  await taskModel.delbyidboard(req.params.id);
  res.json("conplete");

});
router.get('/:id/loadtask',isauthenticate, async(req, res) => {
 
   const result=await taskModel.loadtask(req.params.id);
   res.json(result[0].Name);
  
});
router.post('/updatetask',isauthenticate, async(req, res) => {
  const entity=req.body;
 
  console.log(entity);
  await taskModel.patch(entity);
});

router.post('/addboard',isauthenticate, async(req, res) => {
 
 const entity=req.body;
 console.log(entity);
 const result=await boardModel.add(entity);
 res.json("ok");
//  console.log(entity);
});
router.get('/:id/deleteboard',isauthenticate, async(req, res) => {
  await boardModel.del(req.params.id);
  res.json("ok");

});
router.post('/profile',isauthenticate, async(req, res,next) => {
  const entity=req.body;
  const id=req.body.ID;
  await userModel.patch(entity);
  const result=await userModel.loadUserbyID(id)
  res.json(result[0].Name);

});
router.post('/updateboard',isauthenticate, async(req, res) => {
  const entity=req.body;
  await boardModel.patch(entity);
  res.json("complete");
  
});
router.get('/:id/alltask',isauthenticate, async(req, res) => {
 
  const result=await taskModel.loadAllTask(req.params.id);
  res.json(result);
 
});


router.get('/:idtype/:idtask/updatetypetask',isauthenticate, async(req, res) => {
 console.log(req.params.idtype);
 console.log(req.params.idtask);
 const entity=req.body;
 entity.ID=req.params.idtask;
 entity.Type=req.params.idtype;
 await taskModel.patch(entity);
 console.log(entity);

});
module.exports = router;

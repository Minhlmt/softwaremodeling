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
  console.log(req.body);
 const entity=req.body;
 entity.Type=req.params.idtype;
 entity.IDboard=req.params.idboard;
 const result=await taskModel.add(entity);
//  console.log(entity);
});
router.get('/:id/deletetask',isauthenticate, async(req, res) => {
  await taskModel.del(req.params.id);

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
//  console.log(entity);
});
router.get('/:id/deleteboard',isauthenticate, async(req, res) => {
  await boardModel.del(req.params.id);

});
router.post('/profile',isauthenticate, async(req, res,next) => {
  const entity=req.body;
  const id=req.body.ID;
  await userModel.patch(entity);
  const result=await userModel.loadUserbyID(id)
  res.json(result[0].Name);

});
router.post('/updateboardname',isauthenticate, async(req, res) => {
  const entity=req.body;
  await boardModel.patch(entity);
  
});
module.exports = router;

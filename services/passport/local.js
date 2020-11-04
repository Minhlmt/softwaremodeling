const express = require('express');
const { compile } = require('morgan');
const bcrypt = require('bcryptjs');
const userModel = require("../../model/user");
const { use } = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({ session: false }, async (username, password, callback) => {
  // We use default {username: "catlover", password: "cat", id: 1} to authenticate.
  // You should use database to check for user credentials.
  const N=5;
  const user = await userModel.loadUserbyUsername(username);
  const hashpass=bcrypt.hashSync(password, N);
  console.log("pass ",password.toString());
  console.log("hask ",hashpass);
  console.log("data pass ",user[0].Pass);
  console.log(user[0]);
  if (user[0] != null) {
   
    // const rs = bcrypt.compareSync(password, user[0].Pass);
    
    bcrypt.compare(password , user[0].Pass, function(err, res) {
      console.log(res);
      if(res===true){
        callback(null, { id: user[0].ID, username,name:user[0].Name})
      }
      else{
        callback(null, false);
      }
  });


      // if(rs===false){
      //   console.log("no");
      //   callback(null, false);
      // }
      // else{
      //   console.log("yes");
      //   callback(null, { id: user[0].ID, username,name:user[0].Name})
      // }
     
    
    
  }
  else{
    callback(null, false);
  }
    

  // if (username === 'catlover' && password === 'cat') {
  //   callback(null, { id: 1, username, abc:"ok con de" })
  // } else
  //   callback(null, false);
});

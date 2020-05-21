const { Router } = require('express')
const firebase = require('firebase')


const routes = new Router();

routes.post('/signUp', (req, res) => {
  const { email, password, name, type } = req.body
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    if(error) {
      return res.status(409).json({error: error})
    }
  })
  .then(user => {
    let newUser = firebase.auth().currentUser;

    newUser.updateProfile({
      displayName: name,
      
    }).then(function() {
      const db = firebase.database()
      db.ref('users/' + `${newUser.uid}`).set({
        username: name,
        email: email,
        type: type
      });  
      return res.status(200).json({user: newUser});
    })
  })
  .catch(function(error){
    return res.json({error: error})
  })
})

routes.post("/login", (req, res) => {
  const {password, email} = req.body
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if(error) {
      res.json({error: errorMessage})
    }
  })
  .then(user => {
    if(user) {
    firebase.auth().onAuthStateChanged(function(user){
    res.status(200).json({success: user})  
    })}
    //res.status(200).json({success: `user ${user} is logged in`})
  })  
})

module.exports = routes

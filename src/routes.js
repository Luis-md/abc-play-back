const { Router } = require('express')
const firebase = require('firebase')


const routes = new Router();

routes.post('/cadastro', (req, res) => {
  const { email, password, name, type } = req.body
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    
      return res.json({error: error})
  })
  .then(user => {
    let newUser = firebase.auth().currentUser;
      if(newUser !== null) { 
        newUser.updateProfile({
          displayName: name
        }).then(function() {
    
          const db = firebase.database()
          db.ref('users/' + `${newUser.uid}`).set({
            username: name,
            email: email,
            type: type
          });  
          return res.status(200).json({user: newUser});
        })
      } else {
        return res.send()
      }
  })
})

/*LOGIN ROUTE*/ 

routes.post("/login", async (req, res) => {
  const {password, email} = req.body
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
        return res.json({error: error})
    }).then(user => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          return res.json({user: user})
        } else {
          return res.send()
        }
      })
    });
})

module.exports = routes

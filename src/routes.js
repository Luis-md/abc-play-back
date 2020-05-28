const { Router } = require('express')
const firebase = require('firebase')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken');
const config = require('config')



const routes = new Router();

routes.post('/cadastro', (req, res) => {
  const { email, password, name, type } = req.body
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    
      return res.json({error: error})
  })
  .then(() => {
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

          const payload = {
            user: {
                id: newUser.uid
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
          expiresIn: 36000
      }, (err, token) => {
          if(err) throw err;
          res.json({token})
      })

        //return res.status(200).json({user: newUser});
        })
      } else {
        res.status(500).send('server error')
      }
  })
  .catch(function(error) {
    console.error(error)
    res.status(500).send('server error')
  })
})

/*LOGIN ROUTE*/ 

routes.post("/login", async (req, res) => {
  const {password, email} = req.body
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if(errorCode === 'auth/user-not-found') {
        return res.json({error: 'Usuário não cadastrado na base de dados'})
      } else {
        return res.json({error: 'Email ou senha incorretos'})
      }
    }).then(user => {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

          const payload = {
            user: {
                id: user.uid
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), {
          expiresIn: 36000
      }, (err, token) => {
          if(err) throw err;
          res.json({token})
      })
        }
      })
    }).catch(err => {
        res.status(500).send('server error')
        
    })
})

/*GET USER*/

routes.get('/user', auth, (req, res) => {

  try {
      const user = firebase.database().ref(`users/${req.user.id}`)
      user.once(`value`, (snap) => {
          res.json(snap.val())
      })
  } catch (error) {
      res.status(500).send('server error')
  }
})

routes.get('/serie', auth, (req, res) => {
  try {
    const assuntos = firebase.database().ref(`serie`)
      assuntos.once(`value`, (snap) => {
          res.json(snap.val())
      })
  } catch (err) {
    res.status(500).send('server error')
  }
})
module.exports = routes

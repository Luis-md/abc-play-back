const firebase = require('firebase')

const bd = firebase.database()

const authSuccess = (uid, email, name, type) => {
    const db = firebase.database()
    db.ref('users/' + uid).set({
      username: name,
      email: email,
      type: type
    });
}

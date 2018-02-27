const firebase = require('firebase');
// const
// import * as firebase from 'firebase';
// import 'firebase/database';

class FirebaseConnector {

  constructor() {
    var config = {
      apiKey: "AIzaSyAUpkVJ8jm9iKWeGh4Y44CSRKXVmg-1vRc",
      authDomain: "trainspotter-1517511501017.firebaseapp.com",
      databaseURL: "https://trainspotter-1517511501017.firebaseio.com",
      projectId: "trainspotter-1517511501017",
      storageBucket: "trainspotter-1517511501017.appspot.com",
      messagingSenderId: "463575607067"
    };
    firebase.initializeApp(config);
    firebase.auth().signInAnonymously().then((success) => {
      this.database = firebase.database();
    });
  }

  clearData() {
    this.database.ref().set(null);
  }

  uploadData() {
    // this.database.ref.set
  }

}

module.exports = FirebaseConnector;
// export default FirebaseConnector;

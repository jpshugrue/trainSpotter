const firebase = require('firebase');

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

  getData(feedId, callback) {
    this.database.ref(feedId).once('value').then((snapshot) => {
      callback(snapshot);
    });
  }

  getAllData(callback) {
    this.database.ref().once('value').then((snapshot) => {
      callback(snapshot);
    });
  }

  clearData(feedId) {
    this.database.ref(feedId).set(null);
  }

  clearAllData() {
    this.database.ref().set(null);
  }

  uploadData(data, feedId) {
    this.database.ref(feedId).set(data);
  }

}

module.exports = FirebaseConnector;

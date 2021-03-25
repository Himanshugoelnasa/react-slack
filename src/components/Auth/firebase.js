
import firebase from 'firebase/app'
import 'firebase/firebase-auth';
import 'firebase/firebase-database';
import 'firebase/firebase-storage';


  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyBx7Rtukmd-vAV8Ce7IpCxXdBINITe_DyA",
    authDomain: "api-project-377229507570.firebaseapp.com",
    databaseURL: "api-project-377229507570-default-rtdb.firebaseio.com/",
    projectId: "api-project-377229507570",
    storageBucket: "api-project-377229507570.appspot.com",
    messagingSenderId: "377229507570",
    appId: "1:377229507570:web:c9c47e5bc4601dd7fe496b",
    measurementId: "G-MVPSE9773X"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;

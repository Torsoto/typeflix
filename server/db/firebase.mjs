const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDOtPk6wM2Y_fsXlHIL_WqCfcxoAIix6OQ",
  authDomain: "typeflix-e1cd1.firebaseapp.com",
  projectId: "typeflix-e1cd1",
  storageBucket: "typeflix-e1cd1.appspot.com",
  messagingSenderId: "297553572938",
  appId: "1:297553572938:web:5436f9c59c0dca935e22b3",
  measurementId: "G-B9M4EJBVDB",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

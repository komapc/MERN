import * as firebase from "firebase/app";
import "firebase/messaging";
const initializedFirebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4",
    authDomain: "tabsur.firebaseapp.com",
    databaseURL: "https://tabsur.firebaseio.com",
    projectId: "tabsur",
    storageBucket: "tabsur.appspot.com",
    messagingSenderId: "156567484209",
    appId: "1:156567484209:web:811366754f1a296b482210"
});
const messaging = initializedFirebaseApp.messaging();
messaging.usePublicVapidKey(
// Project Settings => Cloud Messaging => Web Push certificates
  "BNJJF1av86BIQPia6y1p4aqlPNRkH4C7IkExrREYb5xyr1EDpUAJtxMrVs0cpCeoIJjP2WEQGIC9FkKDamngxGc"
);
export { messaging };
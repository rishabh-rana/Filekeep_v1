import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth";
import { FirebaseConfig } from "./keys.js";

firebase.initializeApp(FirebaseConfig);

const firestore = firebase.firestore();
firestore.settings({
  timestampsInSnapshots: true
});
firestore.enablePersistence();

const storage = firebase.storage().ref();
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const per = firebase.auth.Auth.Persistence.LOCAL;

export { firestore, storage, provider, auth, per };

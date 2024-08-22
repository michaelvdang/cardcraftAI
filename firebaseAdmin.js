// to verify user with firebase
// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");

import admin from "firebase-admin";
// import serviceAccount from "./serviceAccountKey" with { type: "json" };
import serviceAccount from "./flashcard-saas-serviceAccountKey.js";
// import * as serviceAccount from "./serviceAccountKey.js";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export default admin
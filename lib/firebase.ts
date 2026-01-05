import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHHMdOwrYmrJ6AqtvxXGajmPX-J1ukxG8",
  authDomain: "cmspaneltrive.firebaseapp.com",
  projectId: "cmspaneltrive",
  storageBucket: "cmspaneltrive.firebasestorage.app",
  messagingSenderId: "333019166728",
  appId: "1:333019166728:web:3ced4b094e287bae4579bd",
  measurementId: "G-5D16K77XD0"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize services
let analytics: Analytics | null = null;
const db = getFirestore(app);
const auth = getAuth(app);

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics, db, auth };


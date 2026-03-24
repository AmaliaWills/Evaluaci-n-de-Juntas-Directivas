import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKpGayxIlrJcrrkoU4E7D3QGa9eU6Snug",
  authDomain: "evaluacion-jd.firebaseapp.com",
  projectId: "evaluacion-jd",
  storageBucket: "evaluacion-jd.firebasestorage.app",
  messagingSenderId: "20574458139",
  appId: "1:20574458139:web:6f5ef4203a03793a3f83be"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCQS1hYvkJ4oWW92aLQvMxhjKZP_RIVi0o",
  authDomain: "autolink-58fdf.firebaseapp.com",
  projectId: "autolink-58fdf",
  storageBucket: "autolink-58fdf.firebasestorage.app",
  messagingSenderId: "962454186683",
  appId: "1:962454186683:web:f87f37786870764bf1979e",
  measurementId: "G-JF4FGF1F82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
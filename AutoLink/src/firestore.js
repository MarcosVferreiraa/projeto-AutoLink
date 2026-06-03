
import {getFirestore} from "firebase/firestore";
import app from "./Firebase";
 
const db = getFirestore(app);

export  default db;
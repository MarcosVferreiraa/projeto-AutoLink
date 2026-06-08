import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);

    async function login(email, password) {
        return await signInWithEmailAndPassword(auth, email, password);
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const docUser = await getDoc(
                    doc(db, "users", firebaseUser.uid)
                );

                setUserProfile(
                    docUser.exists()
                        ? docUser.data()
                        : null
                );
            } else {
                setUserProfile(null);
            }
        });

        return unsub;
    }, []);

    return (
        <AuthContext.Provider value={{ user, userProfile, login }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
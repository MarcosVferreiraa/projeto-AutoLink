import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../../firebase/firebase";

const AuthContext = createContext(undefined);

const SESSION_DURATION = 60 * 60 * 1000; // 60 min

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [sessionExpired, setSessionExpired] =
    useState(false);

  const [countdown, setCountdown] =
    useState(3);

  // =========================
  // LOGIN
  // =========================
  async function login(email, password) {
    // ADMIN FIXO PARA DESENVOLVIMENTO
    if (
      email === "admin@stand.com" &&
      password === "123456"
    ) {
      const mockAdminUser = {
        uid: "admin-fixo-desenvolvimento-123",
      };

      const mockAdminProfile = {
        name: "Administrador Geral",
        email: "admin@stand.com",
        phone: "912345678",
        role: "admin",
        approved: true,
      };

      setUser(mockAdminUser);
      setUserProfile(mockAdminProfile);

      return {
        user: mockAdminUser,
      };
    }

    return await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  // =========================
  // REGISTRO
  // =========================
  async function register(
    name,
    email,
    password,
    phone,
    role = "user"
  ) {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    await setDoc(
      doc(
        db,
        "users",
        userCredential.user.uid
      ),
      {
        uid: userCredential.user.uid,
        name,
        email,
        phone,
        role,
        approved: false,
        createdAt: new Date(),
      }
    );

    return userCredential;
  }

  // =========================
  // LOGOUT
  // =========================
  async function logout() {
    await signOut(auth);

    setUser(null);
    setUserProfile(null);

    setSessionExpired(false);
    setCountdown(3);
  }

  // =========================
  // AUTH OBSERVER
  // =========================
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          // Ignora Firebase quando
          // estiver usando admin fake
          if (
            user?.uid ===
            "admin-fixo-desenvolvimento-123"
          ) {
            return;
          }

          if (firebaseUser) {
            setUser(firebaseUser);

            const userDoc =
              await getDoc(
                doc(
                  db,
                  "users",
                  firebaseUser.uid
                )
              );

            if (userDoc.exists()) {
              setUserProfile(
                userDoc.data()
              );
            } else {
              setUserProfile(null);
            }
          } else {
            setUser(null);
            setUserProfile(null);
          }
        }
      );

    return unsubscribe;
  }, [user]);

  // =========================
  // AUTO LOGOUT
  // =========================
  useEffect(() => {
    if (!user) return;

    let interval;

    const timeout = setTimeout(() => {
      setSessionExpired(true);

      let seconds = 3;

      interval = setInterval(async () => {
        seconds--;

        setCountdown(seconds);

        if (seconds <= 0) {
          clearInterval(interval);

          setSessionExpired(false);

          await signOut(auth);

          setUser(null);
          setUserProfile(null);

          setCountdown(3);
        }
      }, 1000);
    }, SESSION_DURATION);

    return () => {
      clearTimeout(timeout);

      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        login,
        register,
        logout,

        isAdmin:
          userProfile?.role ===
          "admin",

        sessionExpired,
        countdown,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider"
    );
  }

  return context;
}
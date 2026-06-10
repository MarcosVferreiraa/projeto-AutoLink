import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../../firebase/firebase";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<any>;
  register: (
    name: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<any>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] =
    useState<UserProfile | null>(null);

  async function login(
    email: string,
    password: string
  ) {
    return await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  }

  async function register(
    name: string,
    email: string,
    password: string,
    phone: string
  ) {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    await setDoc(
      doc(db, "users", userCredential.user.uid),
      {
        name,
        email,
        phone,
        role: "user",
        createdAt: new Date(),
      }
    );

    return userCredential;
  }

  async function logout() {
    await signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setUser(firebaseUser);

        if (firebaseUser) {
          const userDoc = await getDoc(
            doc(db, "users", firebaseUser.uid)
          );

          if (userDoc.exists()) {
            setUserProfile(
              userDoc.data() as UserProfile
            );
          } else {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      }
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        login,
        register,
        logout,
        isAdmin:
          userProfile?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}
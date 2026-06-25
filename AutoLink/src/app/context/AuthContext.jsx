import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from "firebase/auth";

import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { formatPhoneByThreeDigits } from "../utils/phone";



const AuthContext = createContext(undefined);

const SESSION_DURATION = 60 * 60 * 1000; // 60 min

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const mockAdminSessionRef = useRef(false);

  const [sessionExpired, setSessionExpired] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const providerIds = user?.providerData?.map((provider) => provider?.providerId) || [];

  const canChangePassword = !mockAdminSessionRef.current && providerIds.includes("password");

  async function login(email, password) {
    if (email === "admin@stand.com" && password === "123456") {
      const mockAdminUser = {
        uid: "admin-fixo-desenvolvimento-123",
      };

      const mockAdminProfile = {
        name: "Administrador Geral",
        email: "admin@stand.com",
        phone: "912 345 678",
        role: "admin",
        approved: true,
      };

      setUser(mockAdminUser);
      setUserProfile(mockAdminProfile);
      mockAdminSessionRef.current = true;
      setLoading(false);

      return { user: mockAdminUser };
    }

    return await signInWithEmailAndPassword(auth, email, password);
  }
  async function deleteAccount(password) {
    if (!auth.currentUser) {
      throw new Error("Utilizador não autenticado.");
    }

    const currentUser = auth.currentUser;


    const credential = EmailAuthProvider.credential(
      currentUser.email,
      password
    );

    await reauthenticateWithCredential(
      currentUser,
      credential
    );


    await deleteDoc(doc(db, "users", currentUser.uid));


    await deleteUser(currentUser);

    setUser(null);
    setUserProfile(null);
  }

  async function register(name, email, password, phone, birthDate, role = "user") {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name,
      email,
      phone: formatPhoneByThreeDigits(phone),
      role,
      birthDate,
      approved: false,
      createdAt: new Date(),
    });

    return userCredential;
  }

  async function logout() {
    await signOut(auth);

    setUser(null);
    setUserProfile(null);
    mockAdminSessionRef.current = false;

    setSessionExpired(false);
    setCountdown(3);
  }

  async function updateProfile(profileData) {
    if (!user) {
      throw new Error("Utilizador não autenticado.");
    }

    const payload = {
      name: (profileData?.name || "").trim(),
      phone: formatPhoneByThreeDigits(profileData?.phone || ""),
    };

    if (mockAdminSessionRef.current) {
      setUserProfile((prev) => ({
        ...(prev || {}),
        ...payload,
      }));
      return;
    }

    await updateDoc(doc(db, "users", user.uid), payload);

    setUserProfile((prev) => ({
      ...(prev || {}),
      ...payload,
    }));
  }

  async function changePassword(currentPassword, newPassword) {
    if (mockAdminSessionRef.current) {
      throw new Error("Alteração de senha não disponível para o admin fixo de desenvolvimento.");
    }

    if (!auth.currentUser || !auth.currentUser.email) {
      throw new Error("Utilizador não autenticado para alteração de senha.");
    }

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (mockAdminSessionRef.current) {
        setLoading(false);
        return;
      }

      if (firebaseUser) {
        setUser(firebaseUser);

        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

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
        deleteAccount,
        updateProfile,
        changePassword,
        canChangePassword,
        loading,
        isAdmin: userProfile?.role === "admin",
        sessionExpired,
        countdown,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}
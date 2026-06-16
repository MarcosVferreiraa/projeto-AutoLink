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

const SESSION_DURATION = 60 * 60 * 1000; // 60 minutos        

export function AuthProvider({ children }) {
  // Começa como null para testares o fluxo do Modal de Login normalmente
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [sessionExpired, setSessionExpired] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // =======================================================
  // LOGIN INTELI-BYPASS: ADM COMPATÍVEL COM MIN 6 DÍGITOS
  // =======================================================
  async function login(email, password) {
    // Definimos a credencial com a senha de 6 dígitos '123456'
    if (email === "admin@stand.com" && password === "123456") {
      const mockAdminUser = { uid: "admin-fixo-desenvolvimento-123" };
      const mockAdminProfile = {
        name: "Administrador Geral",
        email: "admin@stand.com",
        phoneNumber: "912345678",
        userType: "admin" // Mantém alinhado com o teu Register.jsx
      };

      setUser(mockAdminUser);
      setUserProfile(mockAdminProfile);
      
      // Retorna a estrutura que o teu modal espera receber para fechar o login com sucesso
      return { user: mockAdminUser };
    }

    // Se NÃO forem as credenciais acima, segue o fluxo normal do Firebase local
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred;
  }

  async function register(name, email, password, phoneNumber) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email,
      name,
      phoneNumber,
      userType: "customer",
    });
    return cred;
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  }

  // OBSERVADOR DO ESTADO DO FIREBASE AJUSTADO PARA EVITAR CONFLITOS
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Se for o nosso Admin fixo de desenvolvimento, ignora o Firebase para não deslogar
      if (user?.uid === "admin-fixo-desenvolvimento-123") return;

      if (firebaseUser) {
        setUser(firebaseUser);
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        } else {
          setUserProfile(null);
        }
      } else {
        // Só limpa o estado se quem saiu NÃO foi o Admin fixo simulado
        if (user?.uid !== "admin-fixo-desenvolvimento-123") {
          setUser(null);
          setUserProfile(null);
        }
      }
    });
    return unsubscribe;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        login,
        register,
        logout,
        // Libera as travas baseadas na flag correta do banco do seu projeto
        isAdmin: userProfile?.userType === "admin", 
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
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
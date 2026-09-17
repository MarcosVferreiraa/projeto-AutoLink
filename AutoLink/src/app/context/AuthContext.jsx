import { createContext, useContext, useEffect, useRef, useState } from "react";
import { apiFetch, clearToken, getToken, jsonBody } from "../api";
import { formatPhoneByThreeDigits } from "../utils/phone";

const AuthContext = createContext(undefined);
const SESSION_DURATION = 60 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(getToken()));
  const [sessionExpired, setSessionExpired] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const sessionTimer = useRef(null);

  const saveSession = (session) => {
    localStorage.setItem("autolink_token", session.token);
    setUser(session.user);
    setUserProfile(session.profile || session.user);
  };

  async function login(email, password) {
    const session = await apiFetch("/auth/login", { method: "POST", body: jsonBody({ email, password }) });
    saveSession(session);
    return session;
  }

  async function register(name, email, password, phone, birthDate, role = "user") {
    const session = await apiFetch("/auth/register", {
      method: "POST",
      body: jsonBody({ name, email, password, phone: formatPhoneByThreeDigits(phone), birthDate, role }),
    });
    saveSession(session);
    return session;
  }

  async function logout() {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    clearToken();
    setUser(null);
    setUserProfile(null);
    setSessionExpired(false);
    setCountdown(3);
  }

  async function resetPassword(email) {
    const normalizedEmail = String(email || "").trim();
    if (!normalizedEmail) throw new Error("Digite um e-mail para recuperar a senha.");
    await apiFetch("/auth/forgot-password", { method: "POST", body: jsonBody({ email: normalizedEmail }) });
  }

  async function updateProfile(profileData) {
    const result = await apiFetch("/users/me", {
      method: "PATCH",
      body: jsonBody({ name: String(profileData?.name || "").trim(), phone: formatPhoneByThreeDigits(profileData?.phone || "") }),
    });
    setUserProfile(result.profile);
  }

  async function changePassword(currentPassword, newPassword) {
    await apiFetch("/users/me/password", { method: "PATCH", body: jsonBody({ currentPassword, newPassword }) });
  }

  async function deleteAccount(password) {
    await apiFetch("/users/me", { method: "DELETE", headers: { "X-Delete-Password": password } });
    clearToken();
    setUser(null);
    setUserProfile(null);
  }

  useEffect(() => {
    if (!getToken()) {
      return undefined;
    }
    apiFetch("/auth/me")
      .then((session) => {
        setUser(session.user);
        setUserProfile(session.profile || session.user);
      })
      .catch(() => clearToken())
      .finally(() => setLoading(false));
    return undefined;
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    sessionTimer.current = setTimeout(() => {
      setSessionExpired(true);
      let seconds = 3;
      const interval = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);
        if (seconds <= 0) {
          clearInterval(interval);
          logout();
        }
      }, 1000);
    }, SESSION_DURATION);
    return () => clearTimeout(sessionTimer.current);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      login,
      register,
      resetPassword,
      logout,
      deleteAccount,
      updateProfile,
      changePassword,
      canChangePassword: Boolean(user),
      loading,
      isAdmin: userProfile?.role === "admin",
      sessionExpired,
      countdown,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}

import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

import { useAuth } from "./context/AuthContext";
import { SessionExpiredModal } from "./components/SessionExpiredModal";

export default function App() {
  const { sessionExpired, countdown } = useAuth();

  
  const handleLogin = () => {
    window.location.href = "/login";     
    // Ou: window.location.reload(); 
  };

  return (
    <>
      <SessionExpiredModal
        isOpen={sessionExpired}
        countdown={countdown}
        onLogin={handleLogin}
      />

      <RouterProvider router={router} />
    </>
  );
}
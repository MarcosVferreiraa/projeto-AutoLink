import { RouterProvider } from "react-router";
import { router } from "./routes";

import { useAuth } from "./context/AuthContext";
import { SessionExpiredModal } from "./components/SessionExpiredModal";

export default function App() {
  const {
    sessionExpired,
    countdown,
  } = useAuth();

  return (
    <>
      <SessionExpiredModal
        isOpen={sessionExpired}
        countdown={countdown}
      />

      <RouterProvider router={router} />
    </>
  );
}
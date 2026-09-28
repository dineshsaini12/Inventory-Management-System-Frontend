import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Check } from "lucide-react";
import { Login } from "./components/Login";
import { AppShell } from "./layouts/AppShell";
import { readData, writeData } from "./utils/demoStorage";
import "./App.css";
export default function App() {
  const [data, setData] = useState(() => readData());
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("dummy-inventory-auth") === "true",
  );
  const [toast, setToast] = useState(null);
  useEffect(() => writeData(data), [data]);
  useEffect(() => {
    if (!toast) return undefined;
    const timeoutId = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timeoutId);
  }, [toast]);
  function notify(message, type = "success") {
    setToast({
      message,
      type,
    });
  }
  function login() {
    localStorage.setItem("dummy-inventory-auth", "true");
    setIsAuthenticated(true);
  }
  function logout() {
    localStorage.removeItem("dummy-inventory-auth");
    setIsAuthenticated(false);
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={login} />
            )
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <AppShell
                data={data}
                setData={setData}
                onLogout={logout}
                notify={notify}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>

      {toast && (
        <div className={`toast ${toast.type}`}>
          <Check size={17} />
          {toast.message}
        </div>
      )}
    </BrowserRouter>
  );
}

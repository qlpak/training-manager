import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Navbar from "./components/NavigationBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AdminView from "./components/AdminView";
import CoachView from "./components/CoachView";
import AthleteView from "./components/AthleteView";

const App = () => {
  const [view, setView] = useState("home");
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setIsLoggedIn(true);
        console.log("User is logged in:", true);
        setView(decoded.role);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        console.log("User is logged in:", false);
        setView("login");
      }
    } else {
      setIsLoggedIn(false);
      console.log("User is logged in:", false);
    }
  }, []);

  const renderView = () => {
    if (view === "login")
      return (
        <LoginForm
          setRole={setRole}
          setView={setView}
          setIsLoggedIn={setIsLoggedIn}
        />
      );
    if (view === "register") return <RegisterForm setView={setView} />;
    if (role === "admin") return <AdminView />;
    if (role === "coach") return <CoachView />;
    if (role === "athlete") return <AthleteView />;
    return <h2>Welcome to Training Manager</h2>;
  };

  return (
    <div>
      <Navbar
        setView={setView}
        setIsLoggedIn={setIsLoggedIn}
        isLoggedIn={isLoggedIn}
      />
      <div className="container mt-4">{renderView()}</div>
    </div>
  );
};

export default App;

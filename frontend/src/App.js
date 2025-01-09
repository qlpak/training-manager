import React, { useState } from "react";
import Navbar from "./components/NavigationBar";
import UsersList from "./components/UsersList";
import PlansList from "./components/PlansList";
import LoginView from "./components/LoginView";

const App = () => {
  const [view, setView] = useState("home");

  const renderView = () => {
    if (view === "users") {
      return <UsersList />;
    } else if (view === "plans") {
      return <PlansList />;
    } else if (view === "login") {
      return <LoginView />;
    }
    return <h2>Welcome to Training Manager</h2>;
  };

  return (
    <div>
      <Navbar setView={setView} />
      <div className="container mt-4">{renderView()}</div>
    </div>
  );
};

export default App;

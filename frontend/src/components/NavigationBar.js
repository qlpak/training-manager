import React from "react";

const Navbar = ({ setView, setIsLoggedIn, isLoggedIn }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <button
          className="navbar-brand btn btn-link text-light"
          onClick={() => setView("home")}
        >
          Training Manager
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-light"
                    onClick={() => setView("login")}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-light"
                    onClick={() => setView("register")}
                  >
                    Register
                  </button>
                </li>
              </>
            )}
            {isLoggedIn && (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-light"
                  onClick={() => {
                    localStorage.clear();
                    setIsLoggedIn(false);
                    console.log("User logged out");
                    setView("login");
                  }}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// src/components/NavBar.js

import React from "react";
import "./NavBar.css"
import { useAuth0 } from "../../react-auth0";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button  className="ButtonLogin"  onClick={() => loginWithRedirect({})}>Log in</button>
      )}

      {isAuthenticated && <button  className="ButtonLogin" onClick={() => logout()}>Log out</button>}
    </div>
  );
};

export default NavBar;
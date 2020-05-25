import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import logo from "../assets/images/GenomeGatewaylogo_4.svg";
import { AppContext } from "../AppContext";
import { history } from "./../util/history";
import { get, put } from "./../util/restUtil";
import { properties } from "./../properties";

const Header = () => {
  const { auth, setAuth } = useContext(AppContext);
  const location = useLocation();
  const [user, setUser] = useState({});
  
  useEffect(() => {
    if (auth && auth.user) {
      get(properties.USER_API + "/" + auth.user.userId).then((resp) => {
        setUser(resp.data);
      });
    }
  }, [auth]);

  return (
    <nav className="navbar navbar-icon-top navbar-expand-lg navbar-dark">
      <Link className="navbar-brand" to="/">
        {/* <img src={logo} alt="logo" /> */}
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent2"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
      </button>
    </nav>
  );
};

export default Header;

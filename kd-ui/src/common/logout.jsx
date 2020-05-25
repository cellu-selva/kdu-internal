import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "../AppContext";

const Logout = () => {
  const { setAuth } = useContext(AppContext);
  setAuth({});
  return <Redirect to="/user/login"></Redirect>;
};

export default Logout;

import React, { createContext, useState, useEffect } from "react";
import { setAccessToken } from "./util/restUtil";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState(localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : {});

  const [selectedPatient, setSelectedPatient] = useState({});

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
    setAccessToken(auth ? auth.accessToken : "");
  }, [auth]);

  return (
    <AppContext.Provider value={{ auth, setAuth, selectedPatient, setSelectedPatient }}>{children}</AppContext.Provider>
  );
};

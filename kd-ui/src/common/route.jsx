import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AppContext } from "../AppContext";

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const { auth } = useContext(AppContext);

  let isAuthenticated = false;
  if (auth && auth.accessToken) {
    isAuthenticated = true;
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/user/login" />
        )
      }
    />
  );
};

export const PublicRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={props => <Component {...props} />} />;
};

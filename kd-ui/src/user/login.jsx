import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { properties } from "../properties";
import { post } from "../util/restUtil";
// import { showSpinner, hideSpinner } from "../common/spinner";
import { AppContext } from "../AppContext";
import { string, object } from "yup";

const validationSchema = object().shape({
  email: string()
    .required('Please_enter_a_valid_email')
    .email('Please_enter_a_valid_email'),
  password: string().required('Please_enter_password')
});

const Login = () => {
  const history = useHistory();
  const [userCred, setUserCred] = useState({ email: "", password: "" });
  const [error, setError] = useState({});

  let { setAuth } = useContext(AppContext);

  useEffect(() => {
    setAuth(null);
  }, [setAuth]);

  const validate = () => {
    try {
      validationSchema.validateSync(userCred, { abortEarly: false });
    } catch (e) {
      e.inner.forEach(err => {
        setError(prevState => {
          return { ...prevState, [err.params.path]: err.message };
        });
      });
      return e;
    }
  };

  const login = () => {
    const error = validate(validationSchema, userCred);
    if (error) return;
    // showSpinner();
    post(properties.USER_API + "/login", userCred)
      .then(resp => {
        setAuth({accessToken: resp.id});
        localStorage.setItem("auth", JSON.stringify(resp.id));
        history.push("/dashboard");
      })
      // .finally(hideSpinner);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="card_shadow">
          <div className="onboard-top">
          <h1>Login</h1>
          </div>
          <div className="onboad-sec">
            <div className="form-block">
              <form method="post">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <div className={error.email ? "error" : ""}>
                        <label className="col-form-label">{'E-mail'}*</label>
                        <input
                          className="form-control"
                          type="email"
                          placeholder={'someone_mail'}
                          data-test="email"
                          value={userCred.email}
                          onChange={e => {
                            setUserCred({ ...userCred, email: e.target.value });
                          }}
                          onKeyPress={e => {
                            if (e.key === "Enter") login();
                          }}
                        />
                        {error.email ? <span className="error-msg">{error.email}</span> : ""}
                      </div>
                      <div className={error.password ? "error" : ""}>
                        <label className="col-form-label">{'Password'}*</label>
                        <input
                          className="form-control"
                          type="password"
                          placeholder="**********"
                          data-test="password"
                          value={userCred.password}
                          onChange={e => {
                            setUserCred({
                              ...userCred,
                              password: e.target.value
                            });
                          }}
                          onKeyPress={e => {
                            if (e.key === "Enter") login();
                          }}
                        />
                        {error.password ? <span className="error-msg">{error.password}</span> : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="button">
              <button className="col-md-4 btn btn-primary" type="button" data-test="login" onClick={login}>
              {'Login'}
              </button>
              <div style={{ padding: "20px" }}>
                <Link to="/user/forgotPassword" data-test="forgotPass">
                 {'Forgot Password'}?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

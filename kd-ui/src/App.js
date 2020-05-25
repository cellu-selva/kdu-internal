import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { PrivateRoute, PublicRoute } from "./common/route";
import Signup from "./user/signup";
import Login from "./user/login";
import Product from "./pages/product";
import Report from "./pages/report";
import Sale from "./pages/sale";
import Stock from "./pages/stock";
import StockSummary from "./pages/stock-sumary";
import Vendor from "./pages/vendor";
import Expenses from "./pages/expenses";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  toast.configure({
    autoClose: 50000,
  });
  return (
    <div className="App">
      <ToastContainer hideProgressBar closeButton={false} />
      <Switch>
        <PublicRoute path="/user/signup/:token" component={Signup} />
        <PublicRoute exact path="/user/login" component={Login} />
        {/* <PrivateRoute exact path="/" component={AppDashboard} /> */}
        <PrivateRoute exact path="/product" component={Product} />
        <PrivateRoute exact path="/stock" component={Stock} />
        <PrivateRoute exact path="/stock-summary" component={StockSummary} />
        <PrivateRoute exact path="/sales" component={Sale} />
        <PrivateRoute exact path="/vendor" component={Vendor} />
        <PrivateRoute exact path="/report" component={Report} />
        <PrivateRoute exact path="/expense" component={Expenses} />
        <Redirect to="/product" />
      </Switch>
    </div>
  );
}

export default App;

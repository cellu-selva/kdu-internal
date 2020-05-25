import React, { useState } from "react";
import { uuid } from 'uuidv4';
import { useHistory, Link } from "react-router-dom";
import AppDashboard from "../dashboard/dashboard"
const Report = () => {
    const history = useHistory();
    return (
        <AppDashboard>
            <div>report</div>
        </AppDashboard>
    )
};

export default Report;

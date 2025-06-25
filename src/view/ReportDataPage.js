import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ModelContext } from "../view-model/ModelContext";

const ReportDataPage = () => {
    const navigate = useNavigate();

    return (
        <div className="report-data-page-container">
             
            <div className="switch-btn-container">
                <button className="switchboard-btn" onClick={() => navigate("/")}>Switchboard</button>
                <button className="switchboard-btn" onClick={() => navigate("/DebuggingPage")}>Methods/Variables</button>
                <button className="switchboard-btn" onClick={() => navigate("/FinchPage")}>Finch</button>
            </div>

        </div>
    );

}

export default ReportDataPage;
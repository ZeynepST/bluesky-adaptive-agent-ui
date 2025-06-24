import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ModelContext } from "../view-model/ModelContext";
import { Tiled } from '@blueskyproject/finch';



const ReportDataPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Tiled tiledBaseUrl='/api/v1'></Tiled>
            <div className="switch-btn-container">
                <button className="switchboard-btn" onClick={() => navigate("/DebuggingPage")}>Switchboard</button>
            </div>
        </div>
    );

}

export default ReportDataPage;
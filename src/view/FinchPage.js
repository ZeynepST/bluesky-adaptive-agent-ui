import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { UidContext } from "../view-model/UidContext";
import { Tiled } from '@blueskyproject/finch';

const TiledDebuggingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="report-data-page-container">
              <Tiled tiledBaseUrl='/api/v1'></Tiled>
            <div className="switch-btn-container">
                <button className="switchboard-btn" onClick={() => navigate("/UidPage")}>UID</button>
            </div>

        </div>
    );
}

export default TiledDebuggingPage;
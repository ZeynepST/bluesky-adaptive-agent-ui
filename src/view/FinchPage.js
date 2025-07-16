import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { UidContext } from "../view-model/UidContext";

/**
 * { Tiled } from '@blueskyproject/finch'; is from the Bluesky/Finch React component library.
 * Original source: https://github.com/bluesky/finch
 * License: BSD 3-Clause License (see original license at the link above)
 */
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
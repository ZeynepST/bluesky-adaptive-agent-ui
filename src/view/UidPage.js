import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ModelContext } from "../view-model/ModelContext";
import { UidContext } from '../view-model/UidContext';
import SideBar from '../components/SideBar';
import UidBanner from '../components/UidBanner';
import '../stylesheets/UidStylesheets/UidPage.css';

/**
 * UidPage is where information for each specific UID will be displayed 
 * 
 */
const UidPage = () => {
    const navigate = useNavigate();
    const { uidsInfo, chosenUid } = useContext(UidContext);


    return (
        <div className="report-data-page-container">
            <div className="report-data-main-layout">
                <SideBar />
                <div className="report-data-main-content">
                    {chosenUid && (
                        <>
                            <UidBanner />
                            <div className="report-data-main-content-container">
                                <h1> Info will be here </h1>
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    );

}

export default UidPage;
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ModelContext } from "../view-model/ModelContext";
import SideBar from '../components/SideBar';

const ReportDataPage = () => {
    const navigate = useNavigate();

    return (
        <div className="report-data-page-container">
            <SideBar />

            <div className="report-data-main-section-container">
         
            </div>

        </div>
    );

}

export default ReportDataPage;
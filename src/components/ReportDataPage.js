import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UidContext } from '../view-model/UidContext';
import '../stylesheets/UidStylesheets/UidBanner.css';
import '../stylesheets/UidStylesheets/SideBar.css';
import '../stylesheets/UidStylesheets/IngestDataPage.css';
import '../stylesheets/UidStylesheets/ReportDataPage.css';

/**
 * ReportDatPage will render the data under the report component of http://localhost:8000/ui/browse
 */

const ReportDataPage=()=>{

    return(
        <h1> This will be the report page</h1>
    );

}

export default ReportDataPage;
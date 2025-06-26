import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UidContext } from '../view-model/UidContext';
import '../stylesheets/UidStylesheets/UidBanner.css';
import '../stylesheets/UidStylesheets/SideBar.css';
import '../stylesheets/UidStylesheets/IngestDataPage.css';

/**
 * IngestDatPage will render the data under the ingest component of http://localhost:8000/ui/browse
 */

const IngestDataPage=()=>{

    return(
        <h1> This will be the ingest page</h1>
    );

}

export default IngestDataPage;
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { UidContext } from '../view-model/UidContext';
import '../stylesheets/SideBar.css';


/**
 * This SideBar component will appear on on the ReportDataPage to display the list of UIDs and the links to their respective 
 * report and ingest page if the UID has this information. 
 */

const SideBar = () => {
    const { uidsInfo } = useContext(UidContext);

    return (
        <aside className="sidebar">
            <h1 className="side-bar-title">List of UIDs</h1>
            <hr className="side-bar-delimiter"/>
            <ul>
                {uidsInfo.map((uid) => (
                    <li key={uid.uidValue}>
                        <Link>{uid.uidValue}</Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default SideBar;
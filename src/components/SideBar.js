import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';
import '../stylesheets/UidStylesheets/SideBar.css';


/**
 * This SideBar component will appear on on the ReportDataPage to display the list of UIDs and the links to their respective 
 * report and ingest page if the UID has this information. 
 */

const SideBar = () => {
    const { uidsInfo } = useContext(UidContext);
    const { viewMode, uidValue } = useParams();

    return (
        <div className="side-bar-container">
            <aside className="sidebar">
                <h1 className="side-bar-title">List of UIDs</h1>
                <hr className="side-bar-delimiter" />
                <ul>
                    {/* uid refers to the different UID objects within uidsInfo */}
                    {uidsInfo.map((uid) => (
                        <li key={uid.uidValue} className={uid.uidValue === uidValue ? "selected-uid" : ""} >
                            <Link to={`/UidPage/${uid.uidValue}`}>{uid.uidValue}</Link>
                        </li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}

export default SideBar;
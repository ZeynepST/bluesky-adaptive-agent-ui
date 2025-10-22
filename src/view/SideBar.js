import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { UidContext } from '../view-model/UidContext';
import { useParams } from 'react-router-dom';

// Stylesheets: 
import '../stylesheets/UidStylesheets/SideBar.css';


/**
 * This SideBar component will appear on on the ReportDataPage to display the list of UIDs and the links to their respective 
 * report and ingest page if the UID has this information. 
 */

/**
 * Sidebar component displays a list of all UIDs from the UidContext
 * 
 *  -Each UID is rendered as a clickable link using React Router.
 *  - If a UID is currently selected (based on the URL param), it is highlighted
 *  - Used within the UID page to allow navigation between UID-specific views.
 * 
 * @component 
 */

const SideBar = () => {
    const { uidsInfo } = useContext(UidContext);
    const { uidValue } = useParams();

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
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { UidContext } from '../view-model/UidContext';
import '../stylesheets/UidStylesheets/SideBar.css';


/**
 * This SideBar component will appear on on the ReportDataPage to display the list of UIDs and the links to their respective 
 * report and ingest page if the UID has this information. 
 */

const SideBar = () => {
    const { uidsInfo, setChosenUidObject, chosenUidObject } = useContext(UidContext);

    return (
        <aside className="sidebar">
            <h1 className="side-bar-title">List of UIDs</h1>
            <hr className="side-bar-delimiter"/>
            <ul>
                {/* uid refers to the different UID objects within uidsInfo */}
                {uidsInfo.map((uid) => (
                    <li key={uid.uidValue} className={uid.uidValue === chosenUidObject?.uidValue ? "selected-uid" : ""} >
                        <Link onClick={()=>setChosenUidObject(uid)}>{uid.uidValue}</Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default SideBar;
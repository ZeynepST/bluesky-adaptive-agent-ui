import { Link } from 'react-router-dom';
import '../stylesheets/SideBar.css';

/**
 * This SideBar component will appear on on the ReportDataPage to display the list of UIDs and the links to their respective 
 * report and ingest page if the UID has this information. 
 */

const SideBar = () => {

    return (
        <aside className="sidebar">
            <h3>List of UIDs</h3>
            <ul>
                <li>
                    <Link to="/">Temp</Link>
                </li>
            </ul>
        </aside>
    );
}

export default SideBar;
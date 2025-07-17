import { Link } from 'react-router-dom';

//Stylesheets:
import '../stylesheets/NavBar.css';

/**
 * NavBar component provides global navigation links for the application.
 * 
 * - Renders links to all major pages: Switchboard, Methods/Variables, UID, and Finch.
 * - Uses `react-router-dom`'s Link component
 * @component
 * @returns {JSX.Element} The rendered navigation bar. 
 */


const NavBar = () => {

    return (
        <nav className="navbar">
            <h1 className="logo"> </h1>
            <ul className="nav-links">
                <li><Link to="/">Switchboard</Link></li>
                <li><Link to="/DebuggingPage">Methods/Variables</Link></li>
                <li><Link to="/UidPage">UID</Link></li>
                <li><Link to="/FinchPage">Finch</Link></li>
            </ul>
        </nav>
    );

}

export default NavBar;
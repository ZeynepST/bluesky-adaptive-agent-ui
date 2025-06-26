import { Link } from 'react-router-dom';
import '../stylesheets/NavBar.css';

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
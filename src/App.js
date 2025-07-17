// React component for routing
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Context Providers for state management 
import { ModelProvider } from './view-model/ModelContext';
import { UidProvider } from './view-model/UidContext';

// Page-level components
import AgentSwitchBoardPage from './view/AgentSwitchBoard';
import DebuggingPage from './view/DebuggingPage';
import UidPage from './view/UidPage';

//Shared layout components 
import NavBar from './components/NavigationBar';
/**
 * '@blueskyproject/finch/style.css' stylesheet and FinchPage is
 *  from the Bluesky/Finch React component library.
 * Original source: https://github.com/bluesky/finch
 * License: BSD 3-Clause License (see original license at the link above)
 */
import '@blueskyproject/finch/style.css';
import FinchPage from './view/FinchPage';

//Stylesheets
import './stylesheets/index.css';

/**
 * Main App component which wraps all page routes with context providers and shared layout.
 * @returns {JSX.Element} The main application structure
 */
function App() {
    return (
        <UidProvider>
            <ModelProvider>
                <div className="main-page">
                    {/* Top navigation bar */}
                    <NavBar />

                    {/* Container for the main content routed by React Router */}
                    <div className="page-content">
                        <Routes>
                            <Route path="/" element={<AgentSwitchBoardPage />} />
                            <Route path="/DebuggingPage" element={<DebuggingPage />} />
                            <Route path="/UidPage" element={<UidPage />} />
                            <Route path="/FinchPage" element={<FinchPage />} />
                            <Route path="/UidPage/:uidValue?/:viewMode?" element={<UidPage />} />
                        </Routes>
                    </div>
                </div>
            </ModelProvider >
        </UidProvider>
    );
};

export default App;

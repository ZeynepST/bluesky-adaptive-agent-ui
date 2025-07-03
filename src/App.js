import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ModelProvider } from './view-model/ModelContext';
import { UidProvider } from './view-model/UidContext';
import AgentSwitchBoardPage from './view/AgentSwitchBoard';
import DebuggingPage from './view/DebuggingPage';
import UidPage from './view/UidPage';
import '@blueskyproject/finch/style.css';
import './stylesheets/index.css';
import FinchPage from './view/FinchPage';
import NavBar from './components/NavigationBar';

function App() {

    return (
        <UidProvider>
            <ModelProvider>
                {/* <UidProvider>   */}
                <div className="main-page">
                    <NavBar />
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

                {/* </UidProvider> */}
            </ModelProvider >
        </UidProvider>
    );
};

export default App;

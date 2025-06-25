import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import {ModelProvider} from './view-model/ModelContext';
import AgentSwitchBoardPage from './view/AgentSwitchBoard';
import DebuggingPage from './view/DebuggingPage';
import ReportDataPage from './view/ReportDataPage';
import '@blueskyproject/finch/style.css';
import './stylesheets/index.css';
import FinchPage from './view/FinchPage';

function App(){

    return(
            <ModelProvider>
                <Routes>
                    <Route path="/" element={<AgentSwitchBoardPage />} />
                    <Route path="/DebuggingPage" element={<DebuggingPage />}/>
                    <Route path="/ReportDataPage" element={<ReportDataPage />}/>
                    <Route path="/FinchPage" element={<FinchPage />}/>

                </Routes>
                
            </ModelProvider>
     );
};

export default App;

import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import {ModelProvider} from './view-model/ModelContext';
import AgentSwitchBoardPage from './view/AgentSwitchBoard';
import DebuggingPage from './view/DebuggingPage';
import './stylesheets/index.css';
// import AgentSwitchBoard from './view/AgentSwitchBoard.js';

function App(){
    
    return(
        <Router>
            <ModelProvider>
                <Routes>
                    <Route path="/" element={<AgentSwitchBoardPage />} />
                    <Route path="/DebuggingPage" element={<DebuggingPage />}/>
                </Routes>
                
            </ModelProvider>
        </Router>
     );
};

export default App;

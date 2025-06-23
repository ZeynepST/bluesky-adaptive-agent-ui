import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import {ModelProvider} from './view-model/ModelContext';
import AgentSwitchBoardPage from './view/AgentSwitchBoard';
import DebuggingPage from './view/DebuggingPage';
import './stylesheets/index.css';
// import { Tiled } from '@blueskyproject/finch';
// import '@blueskyproject/finch/style.css';

function App(){
    
    return(
            <ModelProvider>
                <Routes>
                    <Route path="/" element={<AgentSwitchBoardPage />} />
                    <Route path="/DebuggingPage" element={<DebuggingPage />}/>
                </Routes>
                
            </ModelProvider>
     );
};

export default App;

import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import {ModelProvider} from './view-model/ModelContext';
import HomePage from './view/AgentSwitchBoard';
import './stylesheets/index.css';
// import AgentSwitchBoard from './view/AgentSwitchBoard.js';

function App(){
    
    return(
        <Router>
            <ModelProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
                
            </ModelProvider>
        </Router>
     );
};

export default App;

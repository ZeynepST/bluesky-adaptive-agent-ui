// Entry point for React DOM rendering 
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.js';
import './stylesheets/index.css';

// Create the root element from the HTML div with id="root"
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the React application inside a BrowserRouter for routing
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
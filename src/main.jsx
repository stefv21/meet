import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as atatus from 'atatus-spa';
//import * as serviceWorkerRegistration from './serviceWorkerRegistration';

atatus.config('ee138676f30c49858a9233a6cf6a3105').install();




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

//serviceWorkerRegistration.register();





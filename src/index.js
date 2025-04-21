import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useRoutes } from "react-router-dom";
import AppRoute from './config/app-route.jsx';
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './scss/react.scss';
import './scss/formStyle.css'
import './scss/tableStyle.css'


const container = document.getElementById('root');
const root = createRoot(container);
function App() {		
    let element = useRoutes(AppRoute);	
    return element;			
}

root.render(
  <BrowserRouter>
  	<App />
  </BrowserRouter>
);

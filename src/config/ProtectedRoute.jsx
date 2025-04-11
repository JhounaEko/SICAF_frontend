import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    try {
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
        const data = JSON.parse(Cookies.get(process.env.REACT_APP_COOKIES_NAME_DATA)); 
        if (!(sessionTokenSicaf && data)) {
            return <Navigate to="/" replace />;
            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA); 
        }
        return children; 
    } catch (error) {
        return <Navigate to="/" replace />; 
        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA); 
    }
};

export const ProtectedRouteLogin = ({ children }) => {
   try {
      const data = JSON.parse(Cookies.get(process.env.REACT_APP_COOKIES_NAME_DATA)); 
      const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
      if (sessionTokenSicaf && data) {
        return <Navigate to="/dashboard/v1" state = {data} />   
      } else {
        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN);
        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);
      }
      return children;

   } catch (error) {
      return children; 
   }
 
};

export default ProtectedRoute;
import React from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Cookies from 'js-cookie';

const modelUseNotificaciones = () => {
    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
    let decryptedToken;
    if (sessionTokenSicaf) {
        decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8);
    } else {
        decryptedToken = "not session"
    }
    let returnResponse = {
        status: false,
        response: {},
        title: "",
        message: ""
    }
    const useNotificaciones = async () => {
        try {
            const respose = await axios.get(
                process.env.REACT_APP_API_URL + '/api/v1/notifications',
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + decryptedToken,
                    }
                }
            );
            returnResponse.status = true;
            returnResponse.response = respose.data.results;
            return returnResponse;
        } catch (error) {
            console.log(error);
            returnResponse.status = false;
            returnResponse.response = error;          
            try {
                if (error.code == "ERR_BAD_REQUEST") {
                    if (error.response.data.message === "Unauthenticated."){                                                                                   
                        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN); 
                        Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);                
                        returnResponse.message = "Unauthenticated.";                         
                    } 
                } 
                return returnResponse; 
            } catch(error){
                return returnResponse;    
            } 
        }
    }
    return useNotificaciones;
}

export const modelReadNotificaciones = () => {
    const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
    let decryptedToken;
    if (sessionTokenSicaf) {
        decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8);
    } else {
        decryptedToken = "not session"
    }
    let returnResponse = {
        status: false,
        response: {},
        title: "",
        message: ""
    }
    const uselReadNotificaciones = async (idNotificacion) => {
        try {
            const respose = await axios.patch(
                process.env.REACT_APP_API_URL + '/api/v1/notifications/' + idNotificacion + '/mark-as-read', {},
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + decryptedToken,
                    }
                }
            );
            returnResponse.status = true;
            returnResponse.response = respose.data.results;
            return returnResponse;
        } catch (error) {
            returnResponse.status = false;
            returnResponse.response = error;
            return returnResponse
        }
    }
    return uselReadNotificaciones;
}

export default modelUseNotificaciones;
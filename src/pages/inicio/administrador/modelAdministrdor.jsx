import CryptoJS from 'crypto-js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { addNotification } from './../../../components/alert/alert.jsx';

/** Permite obtener datos de las entidades registradas, conteo total */
export const modelUseStats = () =>{
    const useStats = async () => {
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
            message: "",
            error: {}
        }
         try {
            const response = await axios.get(
                process.env.REACT_APP_API_URL + '/api/v1/stats',
                {
                    params:{},
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer ' + decryptedToken,
                    }
                }
            );
            returnResponse.status = true;
            returnResponse.response = response;
            return returnResponse;
        } catch (error) {
            console.log(error);
            returnResponse.status = false;
            try {
                if (error.response.status === 403) {
                    addNotification('info', 'Aviso', "No tiene permisos para visualizar los datos", 'top-right', 8000, "fas fa-exclamation-circle", null)
                } else {
                    if (error.code == "ERR_BAD_REQUEST") {
                        if (error.response.data.message === "Unauthenticated.") {
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_TOKEN);
                            Cookies.remove(process.env.REACT_APP_COOKIES_NAME_DATA);
                            returnResponse.message = "Unauthenticated.";
                        } else {
                            addNotification('info', 'Aviso', error.response.data.message, 'top-right', 8000, "fas fa-exclamation-circle", null)
                        }
                    } else {
                        addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right', 8000, "fas fa-exclamation-circle", null)

                    }
                }
                return returnResponse;
            } catch (error) {
                addNotification('danger', 'Problema inesperado', "Revice su conexion", 'top-right', 8000, "fas fa-exclamation-circle", null)
                return returnResponse;
            }
        }
    }

    return useStats;

}
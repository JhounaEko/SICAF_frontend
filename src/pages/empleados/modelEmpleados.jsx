import CryptoJS from 'crypto-js'; 
import axios from 'axios';
import Cookies from 'js-cookie';

export const modelUseCreate = () => {

    const useCreate = async (dataForm) => {
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);  
        const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				             
    
        let returnResponse = {
            status: false,
            title:"",
            message:""
        }
    
        try{
            const respose = await axios.post(
                process.env.REACT_APP_API_URL+'/api/v1/employees',                
                    dataForm
                ,{
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer '+decryptedToken,
                    }
                }
            );
            returnResponse.status = true;
            return returnResponse;
        } catch (error) {
            returnResponse.status = false;
            if (error.code == "ERR_BAD_REQUEST") {
                returnResponse.title = "Aviso";
                returnResponse.message =  error.response.data.message;
            } else {
                returnResponse.title = "Problema inesperado";
                returnResponse.message =  "Revice su conexion";
            }
            console.log(error);
            return returnResponse;
        }  
    }
    return useCreate;

}

export const modelChangeStatus = () =>{
    const useChangeStatus = async (statusRow, idRow) =>{
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);  
        const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				             
        let returnResponse = {
            status: false,
            response: {},
            title:"",
            message:"",
            error:{}
        }
       try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/employees/${idRow}` ,
                {
                    "state_id": (statusRow === "INACTIVO")? 1 : 2 
                }, {
                    headers: {
                        'Content-Type': 'application/json',    
                        'Authorization': "Bearer "+decryptedToken,  
                    }  
                }
            );
            returnResponse.status=true;
            return returnResponse;
       } catch (error) {
            console.log(error);
            returnResponse.status=false;
            returnResponse.error = error;
            return returnResponse;     
       }        
    }
    return useChangeStatus;
}

export const modelUseListTable = () =>{
    const useListTable = async (getPag = 1, getSortColumn = 'id', getOrder ="desc", getCountRows = 10 , getSearh = "") => {

        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);  
        const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				             
        
        let returnResponse = {
            status: false,
            response: {},
            title:"",
            message:""
        }
        try {
            const respose = await axios.get(
                process.env.REACT_APP_API_URL+'/api/v1/employees', 
                {
                    params: {
                        state_id: 1,
                        search: getSearh,
                        page: getPag,
                        sort_by: getSortColumn,
                        sort_order: getOrder,
                        row_num: getCountRows
                    },
                    headers: {
                        Accept: 'application/json',
                        Authorization: 'Bearer '+decryptedToken,
                    },
                }
            );
            returnResponse.status =true;
            returnResponse.response =respose;
            return returnResponse;
        } catch (error) {
            console.log(error);
            returnResponse.title = "Problema inesperado";
            returnResponse.message = "Revice su conexion";
            return returnResponse;
        }      
    }
    return useListTable;
}

export const modelChageDataRow = () =>{
    const useChangeDataRow = async (dataForm) =>{
        let returnResponse = {
            status: false,
            response: {},
            title:"",
            message:"",
            error:{}
        }
        const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);  
        const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8); 				             
        try {
            const respose = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/v1/employees/${dataForm.id}`  ,
                  dataForm,
                  {
                      headers: {
                          'Content-Type': 'application/json',    
                          'Authorization': "Bearer "+decryptedToken,  
                      }  
                  }
              );
            returnResponse.status = true; 
            return returnResponse;          
        } catch (error) {
            console.log(error);
            returnResponse.status = false; 
            returnResponse.error = error; 
            if (error.code == "ERR_BAD_REQUEST") {
                returnResponse.title = "Aviso";
                returnResponse.message =  error.response.data.message;
            } else {
                returnResponse.title = "Problema inesperado";
                returnResponse.message =  "Revice su conexion";
            }
            return returnResponse;
        }            
    }
    return useChangeDataRow;  
}
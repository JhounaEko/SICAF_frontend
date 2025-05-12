import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { get, useForm, } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ReactNotifications, Store } from 'react-notifications-component';
import { addNotification } from '../../../components/alert/alert.jsx';

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
//import modelUseListPermition, { modelUseCreateRol, modelUseUpdateRol } from './../modelRoles.jsx';


const ModalLocalizacion = ({ StatusModal, title, CloseModal, dataCurrentRow }) => {

    /** use method globales  */
    // const useCreateRol = modelUseCreateRol();
    // const useListPermition = modelUseListPermition();
    // const useUpdateRol = modelUseUpdateRol();
    const navigation = useNavigate();

    const [stateButton, setStateButton] = useState(false);
    //const [getData, setData] = useState(data);
    //const idRef = useRef(data.id);
    const idRef = useRef(0);


    /** begin select 2 */
    const [isLoadingRoles, setIsLoadingRoles] = useState(false);
    const [defaultOptionsRoles, setDefaultOptionsRoles] = useState([]);
    const [getSelectRoles, setSelectRoles] = useState(false);
    const [getSelectRolesStatus, setSelectRolesStatus] = useState(false);
    const pageCurrentRoles = useRef(1);
    const inputValueRoles = useRef('');
    const hasMoreRoles = useRef(true);

    const peticionPermisos = async (search, pageNumber) => {
        try {
            const dataReturn = await useListPermition(search, pageNumber);
            if (dataReturn.status) {
                try {
                    /** Se verifica que la pagina actual sea menor a la ultima pagina */
                    if (dataReturn.response.data.results.meta.current_page < dataReturn.response.data.results.meta.last_page) {
                        hasMoreRoles.current = true;
                    } else {
                        hasMoreRoles.current = false;
                    }
                    return dataReturn.response.data.results.data;
                } catch (error) {
                    return [];
                }
            } else {
                if (dataReturn.message == "Unauthenticated.") {
                    Swal.fire({
                        title: "Sesion finalizada",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
                    navigation('/');
                }
                return [];
            }
        } catch (error) {
            // console.log(error);
            return [];
        }

    }

    const handleMenuScrollToBottomRoles = async () => {
        if (hasMoreRoles.current) {
            pageCurrentRoles.current = pageCurrentRoles.current + 1;
            const newOptions = await peticionPermisos(inputValueRoles.current, pageCurrentRoles.current);
            try {
                if (newOptions.length != 0) {
                    setDefaultOptionsRoles(prev => [...prev, ...newOptions]);
                }
            } catch (error) {

            }
        }
    }

    // useEffect(() => {
    //     if(StatusModal){
    //         const fetchPeticion = async () => {
    //             const dataReturn = await peticionPermisos("", 1);
    //             setDefaultOptionsRoles(dataReturn);
    //         }
    //         fetchPeticion();
    //     }

    // }, [StatusModal]);
    const loadDataSearchOptionsPermisos = async (inputVal, callback) => {
        inputValueRoles.current = inputVal;
        pageCurrentRoles.current = 1;
        const options = await peticionPermisos(inputVal, pageCurrentRoles.current);
        callback(options);
    };
    /** end select2 */

    const { register, handleSubmit, reset, setValue, formState: { errors }, getValues } = useForm(
        {
            // defaultValues: {
            //     id: data.id ? data.id : 0,
            //     name: data.name ? data.name : "",
            // }
        }
    );

    // if (data.id !== 0 && idRef.current != data.id) {
    //     idRef.current = data.id;
    //     setSelectRoles(data.permissions);
    //     setValue('id', data.id);
    //     setValue('name', data.name);
    // }

    const onSubmit = async (dataTable) => {
        // const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
        // const decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8);
        // if (getSelectRoles.length != 0) {
        //     if (data.id === 0) {
        //         delete dataTable.id;
        //         setStateButton(true);
        //         const arrayIdRoles = getSelectRoles.map((elemento) => (elemento.id));
        //         dataTable.permissions = arrayIdRoles;
        //         const returnData = await useCreateRol(dataTable);
        //         if (returnData.status) {
        //             reserForm();
        //             updateTableData(true);
        //             Swal.fire({
        //                 title: "Registro exitoso",
        //                 icon: "success",
        //                 draggable: true,
        //                 timer: 3000,
        //                 confirmButtonColor: "#3085d6",
        //             });
        //         } else {
        //             if (returnData.message == "Unauthenticated.") {
        //                 Swal.fire({
        //                     title: "Sesion finalizada",
        //                     icon: "success",
        //                     draggable: true,
        //                     timer: 3000,
        //                     confirmButtonColor: "#3085d6",
        //                 });
        //                 navigation('/');
        //             }
        //         }
        //         setStateButton(false);
        //     } else {
        //         const arrayIdRoles = getSelectRoles.map((elemento) => (elemento.id));
        //         dataTable.permissions = arrayIdRoles;
        //         setStateButton(true);
        //         const dataReturn = await useUpdateRol(dataTable);
        //         if (dataReturn.status) {
        //             Swal.fire({
        //                 title: "Se actualizo los datos",
        //                 icon: "success",
        //                 draggable: true,
        //                 timer: 3000,
        //                 confirmButtonColor: "#3085d6",
        //             });
        //             reserForm();
        //             updateTableData(true);
        //         } else {
        //             if (returnData.message == "Unauthenticated.") {
        //                 Swal.fire({
        //                     title: "Sesion finalizada",
        //                     icon: "success",
        //                     draggable: true,
        //                     timer: 3000,
        //                     confirmButtonColor: "#3085d6",
        //                 });
        //                 navigation('/');
        //             }
        //         }
        //         setStateButton(false);
        //     }
        // } else {
        //     addNotification('info', 'Aviso', 'Seleccione los permisos para el rol', 'top-right', 8000, "fas fa-exclamation-circle", null)
        // }


    }

    const reserForm = () => {
        setSelectRoles([]);
        idRef.current = 0;
        CloseModal();
        reset();
    };

    const position = [51.505, -0.09]

    return (<>
        <ReactNotifications />
        <Modal show={StatusModal} size="xl" centered={true} backdrop="static" scrollable={true} onHide={reserForm} >
            <Modal.Header closeButton>
                <Modal.Title ><h4 className="modal-title"><i className="fas fa-map"></i>  {title} {dataCurrentRow.name}</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '350px' }} >
                <form onSubmit={handleSubmit(onSubmit)} id="myFormUsers">
                    <fieldset>
                        <legend className=""></legend>
                        <div className="">
                            <label className="form-label required" htmlFor="name">Lugar:</label>
                            <input className="form-control"
                                type="hidden"
                                id="id"
                                //defaultValue={data.id}                        
                                {...register("id", {})}
                            />
                            <AsyncSelect
                                cacheOptions
                                loadOptions={loadDataSearchOptionsPermisos}
                                defaultOptions={defaultOptionsRoles}
                                getOptionLabel={(option) => option.name}
                                getOptionValue={(option) => option.id}
                                isMulti={true}
                                onMenuScrollToBottom={handleMenuScrollToBottomRoles}
                                onChange={(elemento) => { setSelectRoles(elemento); setSelectRolesStatus(true); }}
                                isLoading={isLoadingRoles}
                                placeholder="Seleccione opción..."
                            // defaultValue={data.permissions}
                            />
                        </div>
                        {/* {errors.name && <div className='mb-3 fs-12px' style={{ color: 'red' }}>{String(errors.name.message)}</div>} */}
                    </fieldset>
                </form>
                <hr className="border border-dark border-1 opacity-500 my-3" />
                <p className="form-label" htmlFor="name">Geolocalización (opcional):</p>
                <div className="row mb-3">
                    <div className="col-xl-6">
                        <label className="form-label col-form-label col-md-3">Example multiple select</label>
                        <div className="col-md-9">
                            <select multiple className="form-select">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-xl-6" style={{ height: '400px' }}>
                        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                           
                            <Marker position={[51.505, -0.09]}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' onClick={reserForm}> <i className="fas fa-close"></i> &nbsp; Cerrar</Button>
                <Button variant="primary" type='submit' form="myFormUsers" disabled={stateButton}> {stateButton ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-save"></i>)}
                    &nbsp; Guardar </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default ModalLocalizacion;
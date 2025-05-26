import React, { useState, useRef, useEffect, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import AsyncSelect from 'react-select/async';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ReactNotifications } from 'react-notifications-component';
import { Panel, PanelHeader, PanelBody } from './../../../components/panel/panel.jsx';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {messageFinallySesion, messageRegisterDataSuccess, messageUpdateStatusRowSuccess } from './../../../components/alert/alert.jsx';
import { modelUseListPlacesSelect } from './../../lugares/modelLugares.jsx';
import { modelUseListTableOfficeLocation, modelUseCreateLocationOffice, modelChangeStatusOfficeLocation } from './../modelOficina.jsx';


const ModalLocalizacion = ({ StatusModal, title, CloseModal, dataCurrentRow }) => {

    /** use method globales  */
    const useListPlacesSelect = modelUseListPlacesSelect();
    const useListTableOfficeLocation = modelUseListTableOfficeLocation();
    const useCreateLocationOffice = modelUseCreateLocationOffice();
    const useChangeStatusOfficeLocation = modelChangeStatusOfficeLocation();
    const navigation = useNavigate();
    const [stateButton, setStateButton] = useState(false);

    /** begin select 2 */
    const [isLoadingPlacesLocation, setIsLoadingPlacesLocation] = useState(false);
    const [defaultOptionsPlacesLocation, setDefaultOptionsPlacesLocation] = useState([]);
    const [getSelectPlacesLocation, setSelectPlacesLocation] = useState([]);
    const [getSelectPlacesLocationStatus, setSelectPlacesLocationStatus] = useState(false);
    const pageCurrentPlacesLocation = useRef(1);
    const inputValuePlacesLocation = useRef('');
    const hasMorePlacesLocation = useRef(true);

    const peticionListPlaces = async (search, pageNumber) => {
        try {
            setIsLoadingPlacesLocation(true);
            const dataReturn = await useListPlacesSelect(search, pageNumber);
            if (dataReturn.status) {
                try {
                    /** Se verifica que la pagina actual sea menor a la ultima pagina */
                    if (dataReturn.response.data.results.meta.current_page < dataReturn.response.data.results.meta.last_page) {
                        hasMorePlacesLocation.current = true;
                    } else {
                        hasMorePlacesLocation.current = false;
                    }
                    setIsLoadingPlacesLocation(false);
                    return dataReturn.response.data.results.data;
                } catch (error) {
                    setIsLoadingPlacesLocation(false);
                    return [];
                }
            } else {
                setIsLoadingPlacesLocation(false);
                if (dataReturn.message == "Unauthenticated.") {
                    messageFinallySesion();
                    navigation('/');
                }
                setIsLoadingPlacesLocation(false);
                return [];
            }
        } catch (error) {
            setIsLoadingPlacesLocation(false);
            return [];
        }

    }

    const handleMenuScrollToBottomPlacesLocation = async () => {
        if (hasMorePlacesLocation.current) {
            pageCurrentPlacesLocation.current = pageCurrentPlacesLocation.current + 1;
            const newOptions = await peticionListPlaces(inputValuePlacesLocation.current, pageCurrentPlacesLocation.current);         
            try {
                if (newOptions.length != 0) {
                    setDefaultOptionsPlacesLocation(prev => [...prev, ...newOptions]);
                }
            } catch (error) {

            }
        }
    }

    useEffect(() => {
        if (StatusModal) {
            /** When open modal for list select of places */
            const fetchPeticion = async () => {
                const dataReturn = await peticionListPlaces("", 1);
                setDefaultOptionsPlacesLocation(dataReturn);
            }
            fetchPeticion();

            /** When open modal for list in table the place of office */
            const fetchPeticionOfficePlaces = async () => {
                const dataReturn = await peticionListPlacesOffice();
                //  setListPlacesOffice(dataReturn);
            }
            fetchPeticionOfficePlaces();
        }

    }, [StatusModal]);
    const loadDataSearchOptionsPermisos = async (inputVal, callback) => {
        inputValuePlacesLocation.current = inputVal;
        pageCurrentPlacesLocation.current = 1;
        const options = await peticionListPlaces(inputVal, pageCurrentPlacesLocation.current);
        callback(options);
    };
    /** end select2 */

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [progressData, setProgressData] = useState(false);
    const [dataTablePlacesOffice, setDataTablePlacesOffice] = useState([]);
    const peticionListPlacesOffice = async () => {
        setProgressData(true);
        const returnData = await useListTableOfficeLocation(dataCurrentRow.id);
        if (returnData.status) {
            try {
                setDataTablePlacesOffice(returnData.response.data.results.data);
                console.log(returnData.response.data.results.data);
            } catch (error) {
                setDataTablePlacesOffice([]);
            }
        } else {
            setDataTablePlacesOffice([]);
            if (returnData.message == "Unauthenticated.") {
                messageFinallySesion();
                navigation('/');
            }
        }
        setProgressData(false);
    }

    const onSubmit = async (dataTable) => {
        if (getSelectPlacesLocation.length != 0) {
            setSelectPlacesLocationStatus(true);
            setStateButton(true);
            //dataCurrentRow.id, getSelectPlacesLocation.id           
            const dataReturn = await useCreateLocationOffice(dataCurrentRow.id, getSelectPlacesLocation.id)    
            if (dataReturn.status) {
                peticionListPlacesOffice();
                setSelectPlacesLocation([]);
                messageRegisterDataSuccess();
            } else {
                if (dataReturn.message == "Unauthenticated.") {
                    messageFinallySesion();
                    navigation('/');
                }
            }
            setStateButton(false);
        } else {
            setSelectPlacesLocationStatus(false);
        }
    }

    const reserForm = () => {
        setSelectPlacesLocationStatus(false);
        setSelectPlacesLocation([]);
        setDataTablePlacesOffice([]);
        CloseModal();
        reset();
    };

    const peticionChangeStatus = async (statusRow, idRow) => {
        const dataReturn = await useChangeStatusOfficeLocation(statusRow, idRow);
        if (dataReturn.status) {
            peticionListPlacesOffice();
            messageUpdateStatusRowSuccess();
        } else {
            if (dataReturn.message == "Unauthenticated.") {
                messageFinallySesion();
                navigation('/');
            }
        }
    }
    const changeStatus = (statusRow, idRow) => {
        Swal.fire({
            title: (statusRow === "INACTIVO") ? "¿ Esta seguro de cambiar el estado a activo ?" : "¿ Esta seguro de cambiar el estado a inactivo ?",
            text: "",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si cambiar"
        }).then((result) => {
            if (result.isConfirmed) {
                peticionChangeStatus(statusRow, idRow);
            }
        });
    }

    /** LOCALIZACION MAPA */
    const [getPositionMaps, setPositionMaps] = useState([-16.516045771028423, -68.22148203849794])
    const markerIcon = new L.Icon({
        iconUrl: '/assets/img/icon-mark-maps.png',
        iconSize: [70, 50],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    })
    const markerRef = useRef(null);

    const ChangeMapView = ({ coords }) => {
        const map = useMap();
        useEffect(() => {
            if (coords && map) {
                map.setView(coords);
            }
        }, [coords, map]);

        return null;
    };

    return (<>
        <ReactNotifications />
        <Modal show={StatusModal} size="xl" centered={true} backdrop="static" dialogClassName="custom-modal-width" scrollable={false} onHide={reserForm} >
            <Modal.Header closeButton>
                <Modal.Title ><h4 className="modal-title"><i className="fas fa-map"></i>  {title} <span className='fst-italic'> {dataCurrentRow.name} </span> </h4></Modal.Title>
            </Modal.Header>
            <Modal.Body  >
                <form onSubmit={handleSubmit(onSubmit)} id="myFormPlaces">
                    <fieldset>
                        <legend className=""></legend>
                        <div className="position-relative">
                            <label className="form-label required" htmlFor="name">Lugar (Seleccione los lugares a los que corresponde la oficina):</label>
                            <input className="form-control"
                                type="hidden"
                                id="id"
                                {...register("id", {})}
                            />
                            <AsyncSelect
                                cacheOptions
                                id='name'
                                loadOptions={loadDataSearchOptionsPermisos}
                                defaultOptions={defaultOptionsPlacesLocation}
                                getOptionLabel={(option) => option.description}
                                getOptionValue={(option) => option.id}
                                isMulti={false}
                                onMenuScrollToBottom={handleMenuScrollToBottomPlacesLocation}
                                onChange={(elemento) => { setSelectPlacesLocation(elemento); setSelectPlacesLocationStatus(true); }}
                                isLoading={isLoadingPlacesLocation}
                                value={getSelectPlacesLocation}
                                placeholder="Seleccione opción..."
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        marginBottom: '10px',
                                        zIndex: '999'
                                    }),
                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                    menu: (provided) => ({
                                        ...provided,
                                        zIndex: '9999'
                                    })
                                }}
                            />
                            {!getSelectPlacesLocationStatus && (<div className="text-danger small mt-1">Debe seleccionar al menos un lugar.</div>)}                        </div>
                    </fieldset>
                    <div className='d-flex justify-content-center'>
                        <button type="submit" className='btn btn-primary mb-3' form="myFormPlaces" disabled={stateButton}> {stateButton ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-save"></i>)}
                            &nbsp;Guardar datos</button>
                    </div>
                </form>
                <Panel reload={progressData}>
                    <PanelHeader noButton={false} showExpand={false} showReload={false} showCollapse={true}> <span className='fs-5 my-0'> <i className='fa fa-list-ol'></i> &nbsp; Lista de lugares asignados a la oficina </span></PanelHeader>
                    <PanelBody>
                        <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            <table className="table table-striped mb-0 ">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Lugar</th>
                                        <th>Fecha de registro</th>
                                        <th>Ultima modificación</th>
                                        <th>Ubicacion</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(dataTablePlacesOffice.length != 0) ?
                                        dataTablePlacesOffice.map((item, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{item.place.description} ({item.place.code})</td>
                                                <td>{item.created_at}</td>
                                                <td>{item.updated_at}</td>
                                                <td>{(item.place.latitude != null && item.place.latitude != undefined)? (<i className="fas fa-check"></i>): <i className="fas fa-ban"></i>}</td>
                                                <td>
                                                    {(item.state.name === "ACTIVO") ? (<div className="" title="Estado actual del registro activo">
                                                        <i className="fas fa-toggle-on fa-2x me-2" style={{ color: "#276BAA" }} onClick={() => changeStatus(item.state.name, item.id)} ></i>
                                                        <span className="badge badge rounded-pill badge-subtle-success">ACTIVO <i className="fas fa-check"></i></span>
                                                    </div>) :
                                                        (<div className="" title="Estado actual del registro inactivo">
                                                            <i className="fas fa-toggle-off fa-2x me-2" onClick={() => changeStatus(item.state.name, item.id)} ></i>
                                                            <span className="badge bg-danger rounded-pill" >INACTIVO <i className="fas fa-ban"></i></span>
                                                        </div>)}
                                                </td>
                                            </tr>
                                        )) : <tr>
                                            <td colSpan={6} className="text-center fs-4 mt-3">Sin registros</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </PanelBody>
                </Panel>
                <Panel >
                    <PanelHeader noButton={false} showExpand={false} showReload={false} showCollapse={true}> <p className='fs-5 my-0'> <i className='fa fa-map-marked-alt'></i> &nbsp; Geolocalización </p></PanelHeader>
                    <PanelBody>
                        <MapContainer className='' style={{ height: '300px', width: '100%' }} center={getPositionMaps} zoom={10} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='&copy;  Maps GAMEA - S.I.C.A.F.'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <ChangeMapView coords={getPositionMaps} />
                            {dataTablePlacesOffice.map((item, i) => {
                                if (item.state.name == "ACTIVO" && item.place.latitude != null && item.place.latitude != undefined) {
                                    return (<Marker key={i}  position={[parseFloat(item.place.latitude), parseFloat(item.place.longitude)]} icon={markerIcon} draggable={false}  title="Ubicación seleccionada" >
                                        <Popup title='test'>
                                            {item.place.description}
                                        </Popup>
                                    </Marker>)
                                } else { return null; }
                            })
                            }                           
                        </MapContainer>
                    </PanelBody>
                </Panel>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' onClick={reserForm}> <i className="fas fa-close"></i> &nbsp; Cerrar</Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default ModalLocalizacion;
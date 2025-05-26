import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { modelUseCreate, modelChageDataRow } from './../modelLugares.jsx';
import { ReactNotifications } from 'react-notifications-component';
import { validacionesDescripcion, validacionesCodigo, validacionesAbreviacion } from '../../../components/validaciones/validacionesModUsers.jsx';
import { messageFinallySesion, messageRegisterDataSuccess, messageUpdateDataSuccess } from './../../../components/alert/alert.jsx';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CompModalCreateUpdate = ({ StatusModal, CloseModal, title, dataCurrentRow, functionRefreschDataTable }) => {

    const useCreate = modelUseCreate();
    const useChangeDataRow = modelChageDataRow();
    const navigation = useNavigate();
    const [getPositionMaps, setPositionMaps] = useState([-16.515860619952033, -68.22155714035036])

    const idRef = useRef(dataCurrentRow.id);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            latitude: "-16.516045771028423",
            longitude: '-68.22148203849794',
        },
    });




    const onSubmit = async (dataForm) => {
        setStateButton(true);
        /** Se utiliza para registrar datos */
        if (dataForm.id == 0) {
            const result = await useCreate(dataForm);
            if (result.status) {
                reserForm();
                functionRefreschDataTable();
                messageRegisterDataSuccess();
            } else {
                if (result.message == "Unauthenticated.") {
                    messageFinallySesion();
                    navigation('/');
                }
            }
            /** Se utiliza para modificar datos permiso, cuando se pulsa en el boton guardar */
        } else {
            const result = await useChangeDataRow(dataForm);
            if (result.status) {
                reserForm();
                functionRefreschDataTable();
                messageUpdateDataSuccess();
            } else {
                if (result.message == "Unauthenticated.") {
                    messageFinallySesion();
                    navigation('/');
                }
            }
        }
        setStateButton(false);
    }

    useEffect(() => {
        if (StatusModal) {
            /** When update data form */
            if (dataCurrentRow.id !== 0 && idRef.current != dataCurrentRow.id) {
                idRef.current = dataCurrentRow.id;
                setValue('id', dataCurrentRow.id);
                setValue('code', dataCurrentRow.code);
                setValue('abbreviation', dataCurrentRow.abbreviation);
                setValue('description', dataCurrentRow.description);
                setValue('details', dataCurrentRow.details);
                setValue("latitude", dataCurrentRow.latitude);
                setValue("longitude", dataCurrentRow.longitude);
                if (dataCurrentRow.latitude !== null && dataCurrentRow.latitude !== undefined) {
                    setPositionMaps([parseFloat(dataCurrentRow.latitude), parseFloat(dataCurrentRow.longitude)])
                    console.log("getPositionMaps");
                    console.log(getPositionMaps);

                } else {
                    setPositionMaps([-16.515860619952033, -68.22155714035036])
                }
            }
        }

    }, [StatusModal]);


    const [stateButton, setStateButton] = useState(false);
    const reserForm = () => {

        idRef.current = 0;
        reset();
        CloseModal();
    };

    /** Mapa Geolocalización */
    const markerIcon = new L.Icon({
        iconUrl: '/assets/img/icon-mark.png',
        iconSize: [75, 70],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    })

    const markerRef = useRef(null);

    const getLocationLatLon = () => {
        const marker = markerRef.current;
        if (marker != null) {
            const { lat, lng } = marker.getLatLng();
            setValue("latitude", lat);
            setValue("longitude", lng);
        }
    };

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
        <Modal show={StatusModal} size="xl" onHide={reserForm} scrollable={true} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title><h4 className="modal-title"><i className="fas fa-briefcase fa-1_5x"></i> {title}</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)} id="myFormCargo">
                    <fieldset>
                        <legend className="mb-3"></legend>
                        <div className="mb-3">
                            <div className="row gx-2">
                                <div className="col-md-6 mb-0 mb-md-0">
                                    <label className="required form-label" htmlFor="description">Descripción</label>
                                    <input className="form-control"
                                        type="hidden"
                                        id="id"
                                        defaultValue={dataCurrentRow.id}
                                        placeholder=""
                                        {...register("id", {})}
                                    />
                                    <textarea className="form-control"
                                        type="text"
                                        id="description"
                                        rows={2}
                                        placeholder="Ingrese la descrpción del lugar"
                                        {...register("description", validacionesDescripcion)}
                                    />
                                    {errors.description && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.description.message)}</div>}
                                </div>
                                <div className="col-md-6 mb-0 mb-md-0">
                                    <label className="required form-label" htmlFor="code">Codigo</label>
                                    <input className="form-control"
                                        type="text"
                                        id="code"
                                        placeholder="Ingrese el código"
                                        {...register("code", validacionesCodigo)}
                                    />
                                    {errors.code && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.code.message)}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="row gx-2">
                                <div className="col-md-5 mb-2 mb-md-0">
                                    <label className="required mb-2 fs-10 fw-bold" htmlFor="abbreviation" >Abreviación</label>
                                    <input type="text"
                                        className="form-control fs-13px"
                                        id="abbreviation"
                                        placeholder="Ej: CI, DNI, PAS"
                                        {...register("abbreviation", validacionesAbreviacion)}
                                    />
                                    {errors.abbreviation && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.abbreviation.message)}</div>}
                                </div>
                                <div className="col-md-7 mb-2 mb-md-0">
                                    <label className="mb-2 fs-10 fw-bold" htmlFor="details">Detalle (opcional)</label>
                                    <textarea type="text"
                                        className="form-control fs-13px"
                                        id="details"
                                        placeholder=""
                                        rows={2}
                                        {...register("details", {})}
                                    />
                                </div>
                            </div>
                        </div>
                        <hr className="border border-dark border-1 opacity-500 mb-1 mt-3" />
                        <hr className="m-0 mb-1" />
                        <hr className="border border-dark border-1 opacity-500 m-0 mb-3" />

                        <p className="form-label text-center fs-5" >Geolocalización (opcional)</p>
                        <div className="row gx-2 mb-2">
                            <div className="col-md-6 mb-0 mb-md-0">
                                <label className="form-label" htmlFor="latitude">Latitud:</label>
                                <input className="form-control form-control-sm text-secondary"
                                    type="text"
                                    id="latitude"
                                    placeholder=""
                                    disabled
                                    defaultValue={"-16.516045771028423"}
                                    {...register("latitude")}
                                />
                            </div>
                            <div className="col-md-6 mb-0 mb-md-0">
                                <label className="form-label" htmlFor="longitude">Longitud:</label>
                                <input className="form-control form-control-sm text-secondary"
                                    type="text"
                                    id="longitude"
                                    placeholder=""
                                     defaultValue={" -68.22155714035036"}
                                    disabled={true}
                                    {...register("longitude")}
                                />
                            </div>
                        </div>

                        <MapContainer className='' style={{ height: '300px', width: '100%' }} center={getPositionMaps} zoom={13} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='&copy;  Maps GAMEA - S.I.C.A.F.'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                             <ChangeMapView coords={getPositionMaps} />
                            <Marker position={getPositionMaps} icon={markerIcon} draggable={true} eventHandlers={({ dragend: getLocationLatLon })} ref={markerRef}>
                                <Popup>
                                    ¡Seleccione la ubicación!
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </fieldset>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' type='button' onClick={reserForm} > <i className="fas fa-close"></i> Cerrar</Button>
                <Button variant="primary" type='submit' form="myFormCargo" disabled={stateButton}> {stateButton ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-save"></i>)}  &nbsp;Guardar </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default CompModalCreateUpdate;
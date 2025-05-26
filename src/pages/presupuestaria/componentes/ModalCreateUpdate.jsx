import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { modelUseCreate, modelChageDataRow } from '../modelPresupuestaria.jsx';
import Swal from 'sweetalert2';
import { validacionesRubrica, validacionesRubricaDescripcion, validacionesRubricaCicloVida } from '../../../components/validaciones/validacionesModUsers.jsx';
import { ReactNotifications } from 'react-notifications-component';
import { addNotification } from '../../../components/alert/alert.jsx';
import { useNavigate } from 'react-router-dom';
import DateTime from 'react-datetime';
import moment from 'moment';
import 'moment/locale/es';
import 'react-datetime/css/react-datetime.css';

const CompModalCreateUpdate = ({ StatusModal, CloseModal, title, dataCurrentRow, functionRefreschDataTable }) => {

    const useCreate = modelUseCreate();
    const useChangeDataRow = modelChageDataRow();
    const navigation = useNavigate();

    const idRef = useRef(dataCurrentRow.id);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const onSubmit = async (dataForm) => { 
        
        if (dataForm.lifespan == 0){ dataForm.lifespan =""; }       
            if (dataForm.id == 0) {
                setStateButton(true);
                const result = await useCreate(dataForm);
                setStateButton(false);
                if (result.status) {
                    reserForm();
                    functionRefreschDataTable(true);
                    Swal.fire({
                        title: "Registro exitoso",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
                } else {
                    if (result.message == "Unauthenticated.") {
                        Swal.fire({
                            title: "Sesion finalizada",
                            icon: "success",
                            draggable: true,
                            timer: 3000,
                            confirmButtonColor: "#3085d6",
                        });
                        navigation('/');
                    }
                }
                /** Se utiliza para modificar datos oficina, cuando se pulsa en el boton guardar */
            } else {                
                setStateButton(true);  
                //if (dataForm.lifespan == null || dataForm.lifespan == 0) {delete dataForm.lifespan;}  
                console.log(dataForm);        
                const result = await useChangeDataRow(dataForm);
                setStateButton(false);
                if (result.status) {
                    reserForm();
                    functionRefreschDataTable();
                    Swal.fire({
                        title: "Datos actualizado correctamente",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
                } else {
                    if (result.message == "Unauthenticated.") {
                        Swal.fire({
                            title: "Sesion finalizada",
                            icon: "success",
                            draggable: true,
                            timer: 3000,
                            confirmButtonColor: "#3085d6",
                        });
                        navigation('/');
                    }
                }
            }       
    }

    const [stateButton, setStateButton] = useState(false);
    const reserForm = () => {
        idRef.current = 0;
        reset();
        setYearUpdate(null)
        CloseModal();
    };

    useEffect(() => {
        if (StatusModal) {
            /** When update data form */
            if (dataCurrentRow.id !== 0 && idRef.current != dataCurrentRow.id) {
                idRef.current = dataCurrentRow.id;
                setValue('id', dataCurrentRow.id);
                setValue('rubric', dataCurrentRow.rubric);
                setValue('description', dataCurrentRow.description);
                setValue('is_depreciated', dataCurrentRow.is_depreciated);
                setValue('lifespan', dataCurrentRow.lifespan);
            }
        }

    }, [StatusModal]);

    const [yearUpdate, setYearUpdate] = useState(null);

    return (<>
        <ReactNotifications />
        <Modal show={StatusModal} onHide={reserForm} scrollable={true} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title><h4 className="modal-title"><i className="fa fa-list-alt fa-1_5x"></i> {title}</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)} id="myFormOficce">
                    <fieldset>
                        <legend className="mb-3"></legend>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="rubric">Rubrica:</label>
                            <input className="form-control"
                                type="hidden"
                                id="id"
                                defaultValue={dataCurrentRow.id}
                                placeholder=""
                                {...register("id", {})}
                            />
                            <input className="form-control"
                                type="text"
                                id="rubric"
                                placeholder="Ingrese el codigo"
                                {...register("rubric", validacionesRubrica)}
                            />
                            {errors.rubric && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.rubric.message)}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="description">Descripción:</label>
                            <textarea
                                type="text"
                                className="form-control"
                                placeholder="Ingrese la descripción"
                                id="description"
                                {...register("description", validacionesRubricaDescripcion)}
                            />
                            {errors.description && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.description.message)}</div>}
                        </div>
                        <div className="row">
                            <div className="col col-lg-6">
                             
                                    <label className="form-label" htmlFor="lifespan" title="Ciclo de vida operativa del activo">Ciclo de vida [años] <span className='font-weight-bold' style= {{fontStyle: 'italic' }}>(opcional):</span> </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Ciclo de vida"
                                        id="lifespan"
                                        {...register("lifespan", validacionesRubricaCicloVida)}
                                    />
                                    {errors.lifespan && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.lifespan.message)}</div>}
                             

                            </div>
                            <div className="col col-lg-6">
                              
                                    <div className="form-check form-switch mt-4 ms-4">
                                        <input className="form-check-input" type="checkbox" id="is_depreciated" 
                                            style={{ transform: 'scale(1.2)' }}
                                            {...register("is_depreciated")}  />
                                        <label className="form-check-label fs-5 ps-2" for="is_depreciated">Depreciación</label>
                                    </div>
                                
                            </div>
                        </div>
                    </fieldset>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn btn-danger' type='button' onClick={reserForm} > <i className="fas fa-close"></i> Cerrar</Button>
                <Button variant="primary" type='submit' form="myFormOficce" disabled={stateButton}> {stateButton ? (<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />) : (<i className="fas fa-save"></i>)}  &nbsp;Guardar </Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default CompModalCreateUpdate;
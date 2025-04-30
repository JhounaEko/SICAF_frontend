import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useForm } from 'react-hook-form';
import { modelUseCreate, modelChageDataRow } from './../modelCargo.jsx';
import Swal from 'sweetalert2';
import { ReactNotifications } from 'react-notifications-component';
import { addNotification } from './../../../components/alert/alert.jsx';
import { useNavigate } from 'react-router-dom';


const CompModalCreateUpdate = ({ StatusModal, CloseModal, title, dataCurrentRow, functionRefreschDataTable }) => {

    /** Metthod global */
    const useCreate = modelUseCreate();
    const useChangeDataRow = modelChageDataRow();
    const navigation = useNavigate();


    const idRef = useRef(dataCurrentRow.id);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const onSubmit = async (dataForm) => {
        setStateButton(true);
        /** Se utiliza para crear permiso, cuando se pulsa en boton guardar */
        if (dataForm.id == 0) {
            const result = await useCreate(dataForm);
            if (result.status) {
                reserForm();
                functionRefreschDataTable();
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
            /** Se utiliza para modificar datos permiso, cuando se pulsa en el boton guardar */
        } else {
            const result = await useChangeDataRow(dataForm);
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
        setStateButton(false);
    }


    const [stateButton, setStateButton] = useState(false);
    const reserForm = () => {
        idRef.current = 0;
        reset();
        CloseModal();
    };

    if (dataCurrentRow.id !== 0 && idRef.current != dataCurrentRow.id) {
        idRef.current = dataCurrentRow.id;
        setValue('id', dataCurrentRow.id);
        setValue('name', dataCurrentRow.name);
        setValue('description', dataCurrentRow.description);
    }

    return (<>
        <ReactNotifications />
        <Modal show={StatusModal} onHide={reserForm} scrollable={true} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title><h4 className="modal-title"><i className="fas fa-briefcase fa-1_5x"></i> {title}</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)} id="myFormCargo">
                    <fieldset>
                        <legend className="mb-3"></legend>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="name">Nombre del Cargo</label>
                            <input className="form-control"
                                type="hidden"
                                id="id"
                                defaultValue={dataCurrentRow.id}
                                placeholder=""
                                {...register("id", {})}
                            />
                            <input className="form-control"
                                type="text"
                                id="name"
                                placeholder="nombre cargo"
                                {...register("name", {
                                    required: "El nombre es obligatorio",
                                    maxLength: {
                                        value: 60,
                                        message: "El nombre no puede tener más de 60 caracteres",
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "El nombre no puede tener menos de 4",
                                    },
                                    pattern: {
                                        value: /^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-.,]{0,98}[0-9]{0,2}$/,
                                        message: "Nombre inválido: letras, tildes, guiones, puntos, comas, y hasta 2 números al final",
                                    },
                                })}
                            />
                            {errors.name && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.name.message)}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="required form-label" htmlFor="name">Descripcion</label>
                            <input className="form-control"
                                type="text"
                                id="name"
                                placeholder="nombre cargo"
                                {...register("description", {
                                    required: "El campo es obligatorio",
                                    maxLength: {
                                        value: 100,
                                        message: "El nombre no puede tener más de 100 caracteres",
                                    },
                                    minLength: {
                                        value: 3,
                                        message: "El nombre no puede tener menos de 4",
                                    },
                                    pattern: {
                                        value: /^[a-zA-ZÁÉÍÓÚÑáéíóúñ\s\-.,]{0,98}[0-9]{0,2}$/,
                                        message: "Nombre inválido: letras, tildes, guiones, puntos, comas, y hasta 2 números al final",
                                    },
                                })}
                            />
                            {errors.description && <div className='mb-0 mt-2 fs-12px' style={{ color: 'red' }}>{String(errors.description.message)}</div>}
                        </div>
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
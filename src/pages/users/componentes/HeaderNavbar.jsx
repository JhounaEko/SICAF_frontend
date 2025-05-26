import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React, { useState, useEffect, useRef } from 'react';
import ModalCreateUpdate from './ModalCreateUpdate.jsx'
import DateTime from 'react-datetime';
import moment from 'moment';
import 'moment/locale/es';
import 'react-datetime/css/react-datetime.css';
import { ReactNotifications } from 'react-notifications-component';
import { addNotification } from './../../../components/alert/alert.jsx';
const HeaderNavbar = ({ updateTableData, searchData, searchDataParameter }) => {

    /** Modal */
    const [modal, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    };

    const [parameterSearchDataCreate, setParameterSearchDataCreate] = useState('search');


    const FuntionSearchData = (valueInputSearch) => {
        searchData(valueInputSearch);
    }

    const FuntionSearchParameter = (valueSelect, textSelect) => {
        setPlaceHolderInputSearch(textSelect);
        searchDataParameter(valueSelect);
        minDate.current = null;
        maxDate.current = null;
        setSearchValue('');
        FuntionSearchData('');        
    }

    const [placeHolderInputSearch, setPlaceHolderInputSearch] = useState("nombre");
    const [searchValue, setSearchValue] = useState('');  // Se utiliza para limpiar el input se search , cuando se realiza algun evento en el select
    /*** BUSCAR POR FECHAS  */
    useEffect(() => {
        moment.locale('es');
    }, []);

    const minDateRange = (current) => {
        const minDate = moment('2007-01-01', 'YYYY-MM-DD');
        const today = moment();
        return current.isBetween(minDate, today, 'day');
    };


    const minDate = useRef(null);
    const maxDate = useRef(null);

    const maxDateRange = (current) => {
        const today = moment();
        const minDate = moment('2007-01-01', 'YYYY-MM-DD');
        return current.isBetween(minDate, today, 'day');
    };

    const minDateChange = (value) => {
        minDate.current = value;
    };
    const maxDateChange = (value) => {
        maxDate.current = value;
    };

    const submitDateSearch = () => {
        if (!minDate.current || !maxDate.current) {
            addNotification('warning', 'Aviso', 'Debe seleccionar ambas fechas para continuar.', 'top-right', 8000, "fas fa-exclamation-circle", null)
            console.log('Por favor selecciona ambas fechas.');
            return;
        }

        const fechaInicio = moment(minDate.current);
        const fechaFin = moment(maxDate.current);

        if (!fechaInicio.isValid() || !fechaFin.isValid()) {
            addNotification('warning', 'Error de formato', 'Las fechas ingresadas no son válidas. Por favor, seleccione una fecha desde el calendario.', 'top-right', 8000, "fas fa-exclamation-circle", null)
            return;
        }


        if (fechaInicio.isAfter(fechaFin, 'day')) {
            addNotification('warning', 'Aviso', 'La fecha de inicio no puede ser mayor que la fecha de fin.', 'top-right', 8000, "fas fa-exclamation-circle", null)
        } else {
            FuntionSearchData(moment(minDate.current).format('YYYY-MM-DD')+','+moment(maxDate.current).format('YYYY-MM-DD'));
        }
    }

    return (<>
        <ReactNotifications />
        <ModalCreateUpdate
            StatusModal={modal}
            title="Agregar nuevo usuario"
            CloseModal={closeModal}
            data={{
                id: 0,
                first_name: "",
                last_name: "",
                phone_number: "",
                identity_card: "",
                issued_by: "",
                username: "",
                email: ""
            }}
            updateTableData={updateTableData}
        />
        <div className="row">
            <div className="col-lg-3">
                <button className="btn btn-theme btn-rounded px-4 rounded-pill" onClick={openModal}><i className="fas fa-plus fa-1_5x"></i> Agregar nuevo usuario</button>
            </div>
            <div className="col-lg-4">
                <Form.Group as={Row} className="" controlId="searchDataUser">
                    {(parameterSearchDataCreate == "data_crate") ? (
                        <div className="form-group row">
                            <label className="col-lg-3 col-form-label">Fechas:</label>
                            <div className="col-lg-9">
                                <div className="row gx-2">
                                    <div className="col-6">
                                        <DateTime dateFormat="YYYY-MM-DD" timeFormat={false} isValidDate={minDateRange} inputProps={{ placeholder: 'Inicio' }} closeOnSelect={true} onChange={minDateChange} />
                                    </div>
                                    <div className="col-6">
                                        <DateTime dateFormat="YYYY-MM-DD" timeFormat={false} isValidDate={maxDateRange} inputProps={{ placeholder: 'Fin', disabled: false }} closeOnSelect={true} onChange={maxDateChange} />
                                    </div>
                                </div>
                            </div>
                            <button type="button" onClick={() => submitDateSearch()} className='btn btn-sm btn-info m-1 p-0 pt-1 pb-1 btn-rounded rounded-pill'> <i className="fa fa-search fa-lg"></i>  Buscar </button>
                        </div>
                    ) : (<>
                        <div className="position-relative">
                            <input type="text" className="form-control ps-35px rounded-3" placeholder={"Buscar por " + placeHolderInputSearch + ""} value={searchValue}  onChange={(event) => {  setSearchValue(event.target.value); FuntionSearchData(event.target.value); }} />
                            <button className="btn position-absolute start-0 top-0 shadow-none"><i className="fa fa-search fa-lg"></i></button>
                        </div>                        
                    </>)
                    }
                </Form.Group>   
            </div>
            <div className="col-lg-2">               
                <select
                    id="issued_by"
                    className="form-select "
                    defaultValue="search"
                    onChange={(element) => { FuntionSearchParameter(element.target.value, element.target.options[element.target.selectedIndex].text); setParameterSearchDataCreate(element.target.value); }}
                >
                    <option value="search">  nombre</option>
                    <option value="username">usuario</option>
                    {/* <option value="email">Correo</option> */}
                    <option value="identity_card">celula de identidad</option>
                    <option value="data_crate">fecha de registro</option>
                </select>
            </div>
            <div className="col-sm">
            </div>
        </div>
    </>);
}

export default HeaderNavbar;
import { useState, useEffect, useRef } from 'react';
import CompModalCreateUpdate from './ModalCreateUpdate.jsx';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import DateTime from 'react-datetime';
import moment from 'moment';
import 'moment/locale/es';
import 'react-datetime/css/react-datetime.css';
import { ReactNotifications } from 'react-notifications-component';
import { addNotification } from '../../../components/alert/alert.jsx';
import { Icon } from '@iconify/react';

const HeaderNavbar = ({ functionRefreschDataTable, searchData, searchDataParameter, filterColumn }) => {

    /** Modal */
    const [modal, setModal] = useState(false);
    const openModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
    };

    const FuntionSearchData = (data) => {
        searchData(data);
    }

    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [parameterSearchDataCreate, setParameterSearchDataCreate] = useState('search');
    const FuntionSearchParameter = (valueSelect, textSelect) => {
        setPlaceHolderInputSearch(textSelect);
        searchDataParameter(valueSelect);    
        setMaxDate(null);
        setMinDate(null);
        setSearchValue('');
        FuntionSearchData('');
    }

    const [placeHolderInputSearch, setPlaceHolderInputSearch] = useState("nota");
    const [searchValue, setSearchValue] = useState('');  // Se utiliza para limpiar el input se search , cuando se realiza algun evento en el select

    /*** BUSCAR POR FECHAS  */
    useEffect(() => {
        moment.locale('es');
    }, []);

    const minDateRange = (current) => {
        const minDateFecha = moment('2007-01-01', 'YYYY-MM-DD');
        const today = moment();
        return current.isBetween(minDateFecha, today, 'day');
    };

  

    const maxDateRange = (current) => {
        const today = moment();
        const minDate = moment('2007-01-01', 'YYYY-MM-DD');
        return current.isBetween(minDate, today, 'day', '[]');
    };

    const minDateChange = (value) => {
        setMinDate(value);
    };
    const maxDateChange = (value) => {
        setMaxDate(value);
    };

    const submitDateSearch = () => {
        if (!minDate || !maxDate) {
            addNotification('warning', 'Aviso', 'Debe seleccionar ambas fechas para continuar.', 'top-right', 8000, "fas fa-exclamation-circle", null)
            //console.log((minDate.current).format('D-M-YYYY'));
            return;
        }

        const fechaInicio = moment(minDate);
        const fechaFin = moment(maxDate);

        if (!fechaInicio.isValid() || !fechaFin.isValid()) {
            addNotification('warning', 'Error de formato', 'Las fechas ingresadas no son válidas. Por favor, seleccione una fecha desde el calendario.', 'top-right', 8000, "fas fa-exclamation-circle", null)
            return;
        }

        if (fechaInicio.isAfter(fechaFin, 'day')) {
            addNotification('warning', 'Aviso', 'La fecha de inicio no puede ser mayor que la fecha de fin.', 'top-right', 8000, "fas fa-exclamation-circle", null)
        } else {          
            FuntionSearchData(moment(minDate).format('YYYY-MM-DD') + ',' + moment(maxDate).format('YYYY-MM-DD'));
        }
    }

    const changeColumnFilter = (value,indice) => {        
        filterColumn(value,indice);        
    } 

    return (<>
        <ReactNotifications />
        <CompModalCreateUpdate
            StatusModal={modal}
            title="AGREGAR NOTA DE INGRESO"
            CloseModal={closeModal}
            dataCurrentRow={{ id: 0 }}
            functionRefreschDataTable={functionRefreschDataTable}
        />
        <div className="row">
            <div className="col-lg-2">
                <button className="btn btn-theme btn-rounded px-4 rounded-pill" onClick={openModal}><i className="fas fa-plus fa-1_5x" title="Agregar registro"></i>Agregar nota</button>
            </div>
            <div className="col-lg-4">
                <Form.Group as={Row} className="" controlId="searchOffice">
                    {(parameterSearchDataCreate == "data_create" || parameterSearchDataCreate == "date") ? (
                        <div className="form-group row" title="Agregar un rango de fecha">
                            <label className="col-lg-3 col-form-label">Fechas:</label>
                            <div className="col-lg-9">
                                <div className="row gx-2">
                                    <div className="col-6">
                                        <DateTime  key={minDate ? 'with-date' : 'empty'} dateFormat="YYYY-MM-DD" timeFormat={false} isValidDate={minDateRange}  value={minDate}  inputProps={{ placeholder: 'Inicio' }} closeOnSelect={true} onChange={minDateChange} />
                                    </div>
                                    <div className="col-6">
                                        <DateTime  key={minDate ? 'with-date' : 'empty'}  dateFormat="YYYY-MM-DD" timeFormat={false} isValidDate={maxDateRange} value={maxDate} inputProps={{ placeholder: 'Fin', disabled: false }} closeOnSelect={true} onChange={maxDateChange} />
                                    </div>
                                </div>
                            </div>
                            <button type="button" onClick={() => submitDateSearch()} className='btn btn-sm btn-theme m-1 p-0 pt-1 pb-1 btn-rounded rounded-pill'> <i className="fa fa-search fa-lg"></i>  Buscar por {placeHolderInputSearch}</button>
                        </div>
                    ) : (<>
                        <div className="position-relative" title="Busqueda por parametros">
                            <input type="text" className="form-control ps-35px rounded-3" placeholder={"Buscar por " + placeHolderInputSearch + ""} value={searchValue} onChange={(event) => { setSearchValue(event.target.value); FuntionSearchData(event.target.value); }} />
                            <button className="btn position-absolute start-0 top-0 shadow-none"><i className="fa fa-search fa-lg"></i></button>
                        </div>
                    </>)
                    }
                </Form.Group>
            </div>
            <div className="col-lg-3">
                <select
                    id="issued_by"
                    title='Opciones para el buscador'
                    className="form-select"
                    onChange={(element) => {
                        FuntionSearchParameter(element.target.value, element.target.options[element.target.selectedIndex].text);
                        setParameterSearchDataCreate(element.target.value);
                    }}>
                    <option value="note">nota</option>
                    <option value="payment_receipt">recibo de pagos</option>                    
                    <option value="voucher_number">número de vale</option>
                    <option value="expense_receipt">recibo de gastos</option>            
                    <option value="dfm_amount">cantidad DFM</option>
                    <option value="date">fecha DFM</option>
                    <option value="data_create">fecha de registro</option>
                </select>
            </div>
          
            <div className="col-lg-3">
                <div className="d-lg-block d-none">
                    <a  className="btn btn-white d-flex align-items-center rounded-3" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                        <i className="fa fa-lg fa-location-dot me-10px text-body text-opacity-50 d-none"></i>
                        <Icon className="iconify fs-20px my-n1 me-2 ms-n1 text-theme" icon="tabler:align-box-top-center" />
                        Columnas
                        <i className="fa ms-auto fa-chevron-down"></i>
                    </a>
                    <ul className="dropdown-menu">                        
                        <li><span className="dropdown-item d-flex align-items-center" > <input className="form-check-input me-3" type="checkbox" id="checkbox2" defaultChecked onChange={(e) => (changeColumnFilter(e.target.checked,0))} /> <label className="form-check-label" htmlFor="checkbox2">Nota</label> </span></li>
                        <li><span className="dropdown-item d-flex align-items-center" > <input className="form-check-input me-3" type="checkbox" id="checkbox3" defaultChecked  onChange={(e) => (changeColumnFilter(e.target.checked,1))}  /> <label className="form-check-label" htmlFor="checkbox3">Recibo de pago</label> </span></li>
                        <li><span className="dropdown-item d-flex align-items-center" > <input className="form-check-input me-3" type="checkbox" id="checkbox4"  defaultChecked  onChange={(e) => (changeColumnFilter(e.target.checked,2))} /> <label className="form-check-label" htmlFor="checkbox4">Número de vale</label> </span></li>
                        <li><span className="dropdown-item d-flex align-items-center" > <input className="form-check-input me-3" type="checkbox" id="checkbox5"  defaultChecked  onChange={(e) => (changeColumnFilter(e.target.checked,3))} /> <label className="form-check-label" htmlFor="checkbox5">Recibos de gastos</label> </span></li>
                        <li><span className="dropdown-item d-flex align-items-center" > <input className="form-check-input me-3" type="checkbox" id="checkbox6"  defaultChecked  onChange={(e) => (changeColumnFilter(e.target.checked,4))} /> <label className="form-check-label" htmlFor="checkbox6">Cantidad DFM</label> </span></li>                        
                        <li><span className="dropdown-item d-flex align-items-center" > <input className="form-check-input me-3" type="checkbox" id="checkbox7"  defaultChecked  onChange={(e) => (changeColumnFilter(e.target.checked,5))} /> <label className="form-check-label" htmlFor="checkbox7">Fecha DFM</label> </span></li> 
                        <li><span className="dropdown-item d-flex align-items-center" > <input className="form-check-input me-3" type="checkbox" id="checkbox8"  defaultChecked  onChange={(e) => (changeColumnFilter(e.target.checked,6))} /> <label className="form-check-label" htmlFor="checkbox8">Fecha de registro</label> </span></li>                        
                        <li><span className="dropdown-item d-flex align-items-center" > <input className="form-check-input me-3" type="checkbox" id="checkbox8"  defaultChecked  onChange={(e) => (changeColumnFilter(e.target.checked,7))} /> <label className="form-check-label" htmlFor="checkbox9">ultima actualizacion</label> </span></li>                                                                       
                    </ul>
                </div>
            </div>
        </div>
    </>);
}

export default HeaderNavbar;
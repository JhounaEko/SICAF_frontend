import { useState, useEffect, useRef } from 'react';
import CompModalCreateUpdate from './ModalCreateUpdate.jsx';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import DateTime from 'react-datetime';
import AsyncSelect from 'react-select/async';
import moment from 'moment';
import 'moment/locale/es';
import 'react-datetime/css/react-datetime.css';
import { ReactNotifications } from 'react-notifications-component';
import { addNotification } from '../../../components/alert/alert.jsx';

const HeaderNavbar = ({ functionRefreschDataTable, searchData, searchDataParameter, searchDataYear }) => {

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
    const [parameterSearchDataCreate, setParameterSearchDataCreate] = useState('search');
    const FuntionSearchParameter = (valueSelect, textSelect) => {
        setPlaceHolderInputSearch(textSelect);
        searchDataParameter(valueSelect);
        minDate.current = null;
        maxDate.current = null;
        setSearchValue('');
        FuntionSearchData('');
    }

    const [placeHolderInputSearch, setPlaceHolderInputSearch] = useState("descripción");
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
        return current.isBetween(minDate, today, 'day', '[]');
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
            FuntionSearchData(moment(minDate.current).format('YYYY-MM-DD') + ',' + moment(maxDate.current).format('YYYY-MM-DD'));
        }
    }
  
    const [stateLifesPan, setStateLifesPan] = useState(false);

    return (<>
        <ReactNotifications />
        <CompModalCreateUpdate
            StatusModal={modal}
            title="Agregar rubrica presupuestaria"
            CloseModal={closeModal}
            dataCurrentRow={{ id: 0 }}
            functionRefreschDataTable={functionRefreschDataTable}
        />
        <div className="row">
            <div className="col-lg-2">
                <button className="btn btn-info btn-rounded px-4 rounded-pill" onClick={openModal}><i className="fas fa-plus fa-1_5x" title = "Agregar registro"></i>Agregar rubro</button>
            </div>
            <div className="col-lg-4">
                <Form.Group as={Row} className="" controlId="searchOffice">
                    {(parameterSearchDataCreate == "data_create") ? (
                        <div className="form-group row"  title = "Agregar un rango de fecha">
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
                        <div className="position-relative" title = "Busqueda por parametros">
                            <input type={(!stateLifesPan)?"text":"number"} className="form-control ps-35px rounded-3" placeholder={"Buscar por " + placeHolderInputSearch + ""} min={stateLifesPan ? 0 : undefined} value={searchValue} onChange={(event) => { setSearchValue(event.target.value); FuntionSearchData(event.target.value); }} />
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
                    className="form-select "
                    onChange={(element) => {
                        FuntionSearchParameter(element.target.value, element.target.options[element.target.selectedIndex].text);
                        setParameterSearchDataCreate(element.target.value);
                        if(element.target.value == "lifespan"){setStateLifesPan(true)} else { setStateLifesPan(false) }
                    }}>
                    <option value="search">descripción</option>
                    <option value="rubric">rúbrica</option>
                    <option value="lifespan">ciclos de vida</option>
                    <option value="data_create">fecha de registro</option>
                </select>
            </div>
            <div className="col-lg-3">

            </div>
            <div className="col-sm">

            </div>
        </div>
    </>);
}

export default HeaderNavbar;
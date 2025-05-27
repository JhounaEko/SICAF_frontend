import React, { useState } from 'react';
import CompModalCreateUpdate from './ModalCreateUpdate.jsx';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const HeaderNavbar = ({ functionRefreschDataTable, searchData, funtionActivePdf, }) => {

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

    return (<>
        <CompModalCreateUpdate
            StatusModal={modal}
            title="Agregar nuevo Permiso"
            CloseModal={closeModal}
            dataCurrentRow={{ id: 0 }}
            functionRefreschDataTable={functionRefreschDataTable}
        />
        <div className="row">
            <div className="col-sm">
                <button className="btn btn-theme btn-rounded px-4 rounded-pill" onClick={openModal}><i className="fas fa-plus fa-1_5x"></i> Agregar nuevo permisos</button>
            </div>
            <div className="col-sm">
                <Form.Group as={Row} className="" controlId="permisoInput">
                    <div className="position-relative" title="Busqueda por nombre de permiso">
                        <input type={"text"} className="form-control ps-35px rounded-3" placeholder={"Introduzca nombre del permiso"} onChange={(event) => { setSearchValue(event.target.value); FuntionSearchData(event.target.value); }} />
                        <button className="btn position-absolute start-0 top-0 shadow-none"><i className="fa fa-search fa-lg"></i></button>
                    </div>                    
                </Form.Group>
            </div>
            <div className="col-sm">

            </div>
            <div className="col-lg-4">
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-danger btn-rounded rounded-pill"
              onClick={funtionActivePdf}
            >
              <i className="fa fa-file-pdf me-1"></i> PDF
            </button>
            <button
              className="btn btn-success btn-rounded rounded-pill"
              onClick={funtionActivePdf}
            >
              <i className="fa fa-file-pdf me-1"></i> EXCEL
            </button>
          </div>
        </div>
        </div>
    </>);
}

export default HeaderNavbar;
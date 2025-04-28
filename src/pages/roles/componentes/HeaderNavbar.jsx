import React,{useState} from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ModalCreateUpdate from './ModalCreateUpdate.jsx'

const HeaderNavbar = ({updateTableData, searchData}) => {
     /** Modal */
     const [modal, setModal] = useState(false);
     const openModal = () =>{            
        setModal(true);    
     }
     const closeModal = () => {
         setModal(false); 
     };


     const ActionSearchData = (data) =>{
        searchData(data);
     }

    return ( <>
        <ModalCreateUpdate
            StatusModal = {modal}
            title  = "REGISTRAR DATOS DE ROL"
            CloseModal = {closeModal}   
            data={{
                id: 0,
                name:""        
            }}    
            updateTableData = {updateTableData}
        />
        <div className="row">
            <div className="col-sm">
                <button className="btn btn-primary btn-flex" onClick={openModal}> <i className = "fas fa-user fa-1_5x"></i> Nuevo registro</button>
            </div>
            <div className="col-sm">
                <Form.Group as={Row} className="" controlId="">
		 	        <Form.Label column sm="2">Buscar:</Form.Label>
                    <Col sm="8">
                        <Form.Control 
                            className='form-control m-1 p-1'
                            plaintext
                            placeholder="....."
                            style={{ backgroundColor: '#f0f0f0', color: '#333' }}
                            onChange={(event) =>{ ActionSearchData(event.target.value);  }} 
                        />
                    </Col>
		        </Form.Group>
            </div>
            <div className="col-sm"> 
                    <button className="btn btn-danger m-1" > <i className = "fas fa-file-pdf"></i>PDF</button>
                    <button className="btn btn-success m-1" > <i className = "fas fa-file-excel"></i>EXCEL</button>
                    <button className="btn btn-primary m-1" > <i className = "fas fa-file-word"></i>WORD</button>
            </div>
        </div>  
    </> );
}
 
export default HeaderNavbar;
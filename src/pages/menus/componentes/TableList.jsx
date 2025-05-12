import React, { useState, useEffect } from 'react';
import { modelUseListTable, modelChangeStatus } from '../modelMenu.jsx';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const TableList = () => {

    /** method global */
    const useListTable = modelUseListTable();
    const useChangeStatus = modelChangeStatus();
    const [dataMenus, setDataMenus] = useState([]);
    const navigation = useNavigate();

    const [refrechData, setRefrechData] = useState(false);

    useEffect(() => {
        const peticionDataListMenus = async () => {
            const returnData = await useListTable();            
            if (returnData.status) {                
                console.log(returnData.response.data.results.data);
                setDataMenus(returnData.response.data.results.data);
            } else {
                if (returnData.message == "Unauthenticated.") {
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
        peticionDataListMenus();
    }, [refrechData]);


    const changeStatusMenu = async (statusRow, idRow) => {
        console.log(statusRow);
        Swal.fire({
            title: (statusRow === "INACTIVO") ? "¿ Esta seguro de cambiar el estado a activo ?" : "¿ Esta seguro de cambiar el estado a inactivo ?",
            text: "",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si cambiar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const dataReturn = await useChangeStatus(statusRow, idRow);
                if (dataReturn.status) {
                    setRefrechData(!refrechData)
                    Swal.fire({
                        title: "Se establecio el cambio de estado correctamente",
                        text: "",
                        icon: "success",
                        draggable: true,
                        timer: 3000,
                        confirmButtonColor: "#3085d6",
                    });
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
                }
            }
        });
    }


    return (<>
        <div className="card border-0 p-3">
            <div className="accordion" id="accordion">
                { 
                // console.log(dataMenus)
                    dataMenus.map((item, i) => (
                        <div className="accordion-item border-0" key={i}>
                            <div className="accordion-header" id={`collapsed${(i)}`}>
                                <button className="accordion-button px-3 py-10px pointer-cursor collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseOne${i}`}>
                                    <div className="row p-0 m-0">
                                        <div className="col-md-7">
                                            <i className={item.icon}></i> <b className='fs-5 me-3'>  &nbsp; {item.label}  </b>
                                        </div>
                                        <div className="col-md-2">
                                            <span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center" title = {`Cantidad de submenus ${(item.children) ? item.children.length : "0"}`}>
                                                <i className="fa fa-hashtag fs-9px fa-fw me-5px" ></i>
                                                {(item.children) ? item.children.length : "0"}
                                            </span>
                                        </div>
                                        <div className="col-md-3">

                                            {
                                                (item.state.name === "ACTIVO") ? (<div className="d-flex align-items-center gap-2">

                                                    <i className="fas fa-toggle-on fa-2x" style={{ color: "#276BAA" }} onClick={() => changeStatusMenu(item.state.name, item.id)} ></i>
                                                    <span className="badge badge rounded-pill badge-subtle-success">ACTIVO <i className="fas fa-check"></i></span>
                                                </div>) :
                                                    (<div className="d-flex align-items-center gap-1">
                                                        <i className="fas fa-toggle-off fa-2x" onClick={() => changeStatusMenu(item.state.name, item.id)} ></i>
                                                        <span className="badge bg-danger rounded-pill" >INACTIVO <i className="fas fa-ban"></i></span>
                                                    </div>)
                                            }
                                        </div>
                                    </div>
                                </button>
                            </div>
                            {/** si poseen mas elementos  */}
                            {(item.children) ? (
                                <div id={`collapseOne${i}`} className={`accordion-collapse collapse ${(i == 0) ? "" : ""}`} data-bs-parent="#accordion">
                                    <div className="accordion-body " key={i}>
                                        <div className="row gx-3 p-1 justify-content-center" data-bs-theme="dark">
                                            {(item.children).map((element, i) => (
                                        
                                                    <div className="col-lg-3  d-flex flex-column align-items-center m-3" key={i}>
                                                                    <div className="card border-0 rounded-4 h-100 m-1">
                                                                    <div className="card-body fs-14px p-30px d-flex flex-column">
                                                            <div>
                                                                <b>{element.label}</b>
                                                            </div>
                                                            <div>
                                                                {(element.state.name == "ACTIVO") ? (
                                                                    <div className="badge badge rounded-pill badge-subtle-success m-1" onClick={() => changeStatusMenu(element.state.name, element.id)} >
                                                                        <i className="fas fa-toggle-on fa-2x " style={{ color: "#276BAA" }}  ></i>  <b className='pb-3'> ACTIVO </b>
                                                                        <i className="fas fa-check"></i>
                                                                    </div>
                                                                ) : (
                                                                    <div className="badge badge rounded-pill bg-danger m-1" onClick={() => changeStatusMenu(element.state.name, element.id)}>
                                                                        <i className="fas fa-toggle-off fa-2x " ></i>  <b className='pb-3'> INACTIVO </b>
                                                                        <i className="fas fa-ban"></i>
                                                                    </div>)
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : null
                            }

                        </div>
                    ))
                }
            </div>
        </div>
    </>);
}

export default TableList;
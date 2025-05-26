import React, { useEffect, useState } from 'react';
import { modelUseStats } from './../modelAdministrdor.jsx'
import Swal from 'sweetalert2';
import { ReactNotifications } from 'react-notifications-component';
import { useNavigate, Link } from 'react-router-dom';

const HeaderDataCard = () => {

    /** Metohd glabal */
    const useStats = modelUseStats()
    const navigation = useNavigate();
    const [dataStats, setDataStarts] = useState({});
    const peticionStats = async () => {
        const returnData = await useStats();

        if (returnData.status) {           
            setDataStarts(returnData.response.data.results);
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

    useEffect(() => {
        peticionStats();
    }, []);



    return (<>
        <ReactNotifications />
        <div className="row">
            <div className="col-xl-3 col-md-6">
                <div className="widget widget-stats bg-teal">
                    <div className="stats-icon stats-icon-lg"><i className="fa fa-desktop fa-fw"></i></div>
                    <div className="stats-content">
                        <div className="stats-title">PERSONAL <span className='fw-bold'>S.I.C.A.F.</span> </div>
                        {dataStats?.users?.total && (<div className='m-0 p-0'>
                            <div className="stats-number"> <i className="fa fa-user "></i> {dataStats.users.total}</div>
                            <div className="stats-desc mb-1">Estado activo: {dataStats.users.active}</div>
                            <div className="stats-desc">Estado inactivo: {dataStats.users.inactive}</div>
                            <div className="stats-link">
                                <Link to="/users/pages">Ver detalles <i className="fa fa-arrow-alt-circle-right"></i></Link>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6">
                <div className="widget widget-stats bg-blue">
                    <div className="stats-icon stats-icon-lg"><i className="fa fa-briefcase fa-fw"></i></div>
                    <div className="stats-content">
                        <div className="stats-title">PERSONAL <span className='fw-bold'>G.A.M.E.A.</span> </div>
                        {dataStats?.staff?.total && (<div className='m-0 p-0'>
                            <div className="stats-number"> <i className="fa fa-briefcase "></i> {dataStats.staff.total}</div>
                            <div className="stats-desc mb-1">Estado activo: {dataStats.staff.active}</div>
                            <div className="stats-desc">Estado inactivo: {dataStats.staff.inactive}</div>
                            <div className="stats-link">
                                <Link to="/empleados/pages">Ver detalles <i className="fa fa-arrow-alt-circle-right"></i></Link>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6">
                <div className="widget widget-stats bg-teal">
                    <div className="stats-icon stats-icon-lg"><i className="fa fa-building fa-fw"></i></div>
                    <div className="stats-content">
                        <div className="stats-title">OFICINAS <span className='fw-bold'> </span> </div>
                        {dataStats?.offices?.total && (<div className='m-0 p-0'>
                            <div className="stats-number"> <i className="fa fa-building "></i> {dataStats.offices.total}</div>
                            <div className="stats-desc mb-1">Estado activo: {dataStats.offices.active}</div>
                            <div className="stats-desc">Estado inactivo: {dataStats.offices.inactive}</div>
                            <div className="stats-link">
                                <Link to="/oficinas/pages">Ver detalles <i className="fa fa-arrow-alt-circle-right"></i></Link>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-xl-3 col-md-6">
                <div className="widget widget-stats bg-blue">
                    <div className="stats-icon stats-icon-md"><i className="fa fa-book fa-fw"></i></div>
                    <div className="stats-content">
                        <div className="stats-title">AUDITORIA <span className='fw-bold'> </span> </div>
                        {dataStats?.audits?.total && (<div className='m-0 p-0'>
                            <div className="stats-number">  <span className='fs-5'> EVENTOS  </span> {dataStats.audits.total}</div>
                            <div className="stats-desc mb-1">Ultimas 24hr.: {dataStats.audits.last_24_hours}</div>
                            <div className="stats-desc">Eventos: Crear y modificar registros </div>
                            <div className="stats-link">
                                <Link to="/auditoria/pages">Ver detalles <i className="fa fa-arrow-alt-circle-right"></i></Link>
                            </div>
                        </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    </>);
}

export default HeaderDataCard;
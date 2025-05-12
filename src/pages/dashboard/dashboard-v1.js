import React, {useState, useEffect} from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import Cookies from 'js-cookie';

import {
  Panel,
  PanelHeader,
  PanelBody,
  PanelFooter,
} from "./../../components/panel/panel.jsx";
import "react-calendar/dist/Calendar.css";
///////////////////////////////////////////////////
import PDF from "../../assets/components/PDF.jsx";
import { PDFViewer, pdf } from "@react-pdf/renderer"; // <-- Importa pdf aquí

function DashboardV1() {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  //   mod reporte pdf (mostrar)
  const [mostrarPDF, setMostrarPDF] = useState(false);

  // Mostrar el PDF en una nueva pestaña
  const handleVerPDF = async () => {
    try {
		const blob = await pdf(<PDF estados={estados} />).toBlob();
		const url = URL.createObjectURL(blob);
	
		const link = document.createElement("a");
		link.href = url;
	
		// Definir el nombre dinámico del archivo con fecha y hora
		const date = new Date();
		const formattedDate = date.toLocaleDateString("es-ES", {
		  day: "2-digit",
		  month: "long",
		  year: "numeric",
		});
		const formattedTime = date.toLocaleTimeString("es-ES", {
		  hour: "2-digit",
		  minute: "2-digit",
		  second: "2-digit",
		});
	
		// Asignar el nombre del archivo con la fecha y hora
		link.download = `Reporte de Estados - ${formattedDate} ${formattedTime}.pdf`;
	
		link.click();
	
		// Abrir el PDF en una nueva pestaña
		window.open(url, "_blank");
	  } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };
  //// endpoint para obtener los datos de la tabla ESTADOS
  const obtenerDatos = async () => {

	const sessionTokenSicaf = Cookies.get(process.env.REACT_APP_COOKIES_NAME_TOKEN);
	let decryptedToken;
	if (sessionTokenSicaf) {
		decryptedToken = CryptoJS.AES.decrypt(sessionTokenSicaf, process.env.REACT_APP_API_KEY).toString(CryptoJS.enc.Utf8);
	} else {
		decryptedToken = "not session"
	}

	console.log(decryptedToken);

    try {
      setLoading(true);
      const respuesta = await axios.get(
        process.env.REACT_APP_API_URL+"/api/v1/states",
        {
          headers: {
            Authorization:
              "Bearer "+decryptedToken,
            Accept: "application/json",
          },
        }
      );
	  console.log("respuesta");
	  console.log(respuesta);
      setEstados(respuesta.data.results.data);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };
  //// fin endpoint ////

  useEffect(() => {
    obtenerDatos();
  }, []);

  return (
    <div>
      <h1 className="page-header">
        Dashboard <small>header small text goes here...</small>
      </h1>

      <div className="row">
        <div className="col-12">
          <Panel>
            <PanelHeader>Estados desde API (endpoint)</PanelHeader>
            <PanelBody>
              {loading ? (
                <p>
                  <i className="fa fa-spinner fa-spin me-2"></i>Obteniendo
                  datos...
                </p>
              ) : (
                <ul>
                  {estados.map((estado, index) => (
                    <li key={index}>
                      <strong>{estado.name}</strong> - Código: {estado.code} -{" "}
                      {estado.description}
                    </li>
                  ))}
                </ul>
              )}
            </PanelBody>
            <PanelFooter>
              Última actualización:{" "}
              {new Date().toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}{" "}
              {new Date().toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </PanelFooter>
          </Panel>
          {/* ///////// MOD REPORTE PDF ////////// */}
          {/* Botón para mostrar el PDF en nueva pestaña */}
          <button
            className="btn btn-sm btn-primary mb-3 me-2"
            onClick={handleVerPDF}
            disabled={loading}
          >
            {loading ? "Generando..." : "VER PDF en nueva pestaña"}
          </button>

          {/* Botón para mostrar el PDF en la misma página */}
          <button
            className="btn btn-sm btn-secondary mb-3"
            onClick={() => setMostrarPDF(!mostrarPDF)}
            disabled={loading}
          >
            {mostrarPDF ? "Ocultar PDF" : "Ver PDF"}
          </button>

          {/* Vista embebida del PDF */}
          {mostrarPDF && !loading && (
            <div style={{ height: "600px", border: "1px solid #ddd" }}>
              <PDFViewer width="100%" height="100%">
                <PDF estados={estados} />
              </PDFViewer>
            </div>
          )}
		  
          {/* ///////// FIN MOD REPORTE PDF ////////// */}
        </div>
      </div>
    </div>
  );
}

export default DashboardV1;
import React from "react";
// IMPORTE PARA MOD REPORTES EXCEL
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import headerLogo from "../../assets/img/header.png";
import footerLogo from "../../assets/img/footer.png";

// MOD GET datos de secion
import Cookies from "js-cookie"; // datos de secion
const dataUser = Cookies.get(process.env.REACT_APP_COOKIES_NAME_DATA);
let parsedUser = JSON.parse(dataUser);
// console.log("Datos SECION",parsedUser.first_name, parsedUser.last_name);
// FIN MOD GET datos secion

const ExcelExport = () => {
  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Usuarios');

    // Definir columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Correo', key: 'correo', width: 30 },
      { header: 'Edad', key: 'edad', width: 10 },
    ];

    // Datos de ejemplo
    const data = [
      { id: 1, nombre: 'Juan Pérez', correo: 'juan@example.com', edad: 25 },
      { id: 2, nombre: 'Ana Gómez', correo: 'ana@example.com', edad: 30 },
      { id: 3, nombre: 'Luis Ruiz', correo: 'luis@example.com', edad: 28 },
    ];

    // Agregar filas
    data.forEach((item) => worksheet.addRow(item));

    // Estilizar encabezado
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF007ACC' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Ajustar altura de la fila del encabezado
    headerRow.height = 20;

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Guardar archivo
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'Reporte_Usuarios.xlsx');
  };

  return (
    
    <button
    className="btn btn-sm btn-primary"
      onClick={exportExcel}
    >
      <i className = "fas fa-file-excel"></i> Ver EXCEL
    </button>
    
  );
};

export default ExcelExport;


        // <View
        //   style={{
        //     width: "70%",
        //     justifyContent: "center",
        //     alignItems: "center",
        //   }}
        // >
        //   <Text style={styles.title}>LISTA DE {titulo}</Text>
        // </View>
        // <View style={{ width: "30%" }}>
        //   <View
        //     style={{
        //       display: "table",
        //       width: "100%",
        //       border: "1px solid #000",
        //     }}
        //   >
        //     {/* Fila 1: Título "IMPRESIÓN" */}
        //     <View style={{ flexDirection: "row" }}>
        //       <View style={{ width: "100%", padding: 4 }}>
        //         <Text
        //           style={{
        //             textAlign: "center",
        //             fontWeight: "bold",
        //             fontSize: 9,
        //           }}
        //         >
        //           IMPRESIÓN
        //         </Text>
        //       </View>
        //     </View>

        //     {/* Fila 2: USUARIO */}
        //     <View style={{ flexDirection: "row" }}>
        //       <View
        //         style={{
        //           width: "50%",
        //           padding: 4,
        //           alignItems: "flex-end",
        //         }}
        //       >
        //         <Text
        //           style={{
        //             textAlign: "right",
        //             fontWeight: "bold",
        //             fontSize: 9,
        //           }}
        //         >
        //           USUARIO:
        //         </Text>
        //       </View>
        //       <View style={{ width: "50%", padding: 4 }}>
        //         <Text style={{ fontSize: 8 }}>
        //           {parsedUser.first_name} {parsedUser.last_name}
        //         </Text>
        //       </View>
        //     </View>

        //     {/* Fila 3: FECHA */}
        //     <View style={{ flexDirection: "row" }}>
        //       <View
        //         style={{
        //           width: "50%",
        //           padding: 4,
        //           alignItems: "flex-end",
        //         }}
        //       >
        //         <Text
        //           style={{
        //             textAlign: "right",
        //             fontWeight: "bold",
        //             fontSize: 9,
        //           }}
        //         >
        //           FECHA:
        //         </Text>
        //       </View>
        //       <View style={{ width: "50%", padding: 4 }}>
        //         <Text style={{ fontSize: 9 }}>
        //           <Text>{`${new Date()
        //             .getDate()
        //             .toString()
        //             .padStart(2, "0")}/${new Date()
        //             .toLocaleString("es-ES", { month: "short" })
        //             .toLowerCase()}/${new Date().getFullYear()}`}</Text>
        //         </Text>
        //       </View>
        //     </View>
        //   </View>
        // </View>
import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Cookies from "js-cookie";

const dataUser = Cookies.get(process.env.REACT_APP_COOKIES_NAME_DATA);
let parsedUser = null;
if (dataUser) {
  try {
    parsedUser = JSON.parse(dataUser);
  } catch (error) {
    console.error("Error al parsear dataUser:", error);
  }
}

const ExcelExport = ({ data, titulo, columnas }) => {
  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte");

    // Agrega encabezado
    const headerRow = worksheet.addRow(columnas);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "000000" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF007C" },
      };
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    headerRow.height = 30;

    // Agrega filas de datos
    data.forEach((item) => {
      const rowValues = columnas.map((key) => {
        // Soporte para campos anidados como 'state.name'
        const keys = key.split(".");
        let value = item;
        for (let k of keys) {
          value = value?.[k];
        }
        return value ?? "";
      });
      worksheet.addRow(rowValues);
    });

    // Ajustar ancho de columnas
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length);
      });
      column.width = maxLength + 2;
    });

    // Descargar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `Reporte_${titulo}.xlsx`);
  };

  return (
    <button className="btn btn-sm btn-primary" onClick={exportExcel}>
      <i className="fas fa-file-excel me-1"></i> Ver EXCEL
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
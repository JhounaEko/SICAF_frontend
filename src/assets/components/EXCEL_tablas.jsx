import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Cookies from "js-cookie";
import logo from "../../assets/img/img1.png";

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

    // 1. ENCABEZADO CON LOGO E INFORMACIÓN
    worksheet.mergeCells("A3:I7");
    const titleCell = worksheet.getCell("A3");
    titleCell.value =
      `"NOMBRE DE LA ENTIDAD"\n` +
      `INVENTARIO DETALLADO DE ACTIVOS FIJOS   [Y/O ACTIVOS INTANGIBLES]\n` +
      `[DESCRIPCIÓN DE PROYECTO DE INVERSIÓN] (cuando corresponda)\n` +
      `Al 31 de diciembre de ....\n` +
      `(Expresado en Bolivianos)`;
    titleCell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    titleCell.font = { name: "Arial", size: 11, bold: true };

    // 2. Insertar imagen
    const response = await fetch(logo);
    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const imageId = workbook.addImage({
      buffer: arrayBuffer,
      extension: "png",
    });
    worksheet.addImage(imageId, {
      tl: { col: 1, row: 1 },
      ext: { width: 120, height: 120 },
    });

    // 3. Fila donde empiezan los datos
    const startRow = 10;

    // 4. ENCABEZADOS DE TABLA
    const encabezadosVisibles = {
      id: "Nro",
      name: "NOMBRE PERMISO",
      "state.name": "ESTADO",
      created_at: "FECHA CREACION",
      updated_at: "ULTIMA ACTUALIZACION"
    };

    const headerRow = worksheet.getRow(startRow);
    columnas.forEach((col, index) => {
      const cell = headerRow.getCell(index + 2);
      cell.value = encabezadosVisibles[col] ?? col;
      cell.font = { bold: true, color: { argb: "000000" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "BDD7EE" },
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

    // 5. FILAS DE DATOS
    data.forEach((item, i) => {
      const row = worksheet.getRow(startRow + 1 + i);

      const rowValues = columnas.map((key) => {
        if (key === "id") return i + 1; // Reemplaza "id" con número
        const keys = key.split(".");
        let value = item;
        for (let k of keys) value = value?.[k];
        return value ?? "";
      });

      rowValues.forEach((val, idx) => {
        const cell = row.getCell(idx + 2); // Comienza en la columna B
        cell.value = val;
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // 6. INFORMACIÓN DE USUARIO
    const lastDataRow = startRow + data.length + 2;
    const userCell = worksheet.getCell(lastDataRow, 2);
    userCell.value = `${parsedUser?.first_name ?? ""} ${parsedUser?.last_name ?? ""}`;
    userCell.font = { italic: true };
    userCell.alignment = { vertical: "middle", horizontal: "center" };

    const dateCell = worksheet.getCell(lastDataRow + 1, 2);
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")}/${now
      .toLocaleString("es-ES", { month: "short" })
      .toLowerCase()}/${now.getFullYear()}`;
    dateCell.value = formattedDate;
    dateCell.font = { italic: true };
    dateCell.alignment = { vertical: "middle", horizontal: "center" };

    // 7. AJUSTE DE ANCHO
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        if (cell.row < 10) return;
        const val = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, val.length);
      });
      column.width = maxLength + 3;
    });

    // 8. ZONA DE IMPRESIÓN (borde derecho a 2 columnas del último dato)
    const totalCols = columnas.length + 2;
    for (let i = 0; i <= totalCols; i++) {
      worksheet.getColumn(i + 1);
    }

    worksheet.pageSetup = {
      margins: {
        left: 0.5,
        right: 0.5,
        top: 0.75,
        bottom: 0.75,
        header: 0.3,
        footer: 0.3,
      },
      orientation: "portrait",
      paperSize: 9,
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    };

    // 9. DESCARGAR ARCHIVO
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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

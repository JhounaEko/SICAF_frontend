import { PageBreak } from '@react-pdf/renderer';
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import headerLogo from "../../assets/img/header.png";
import footerLogo from "../../assets/img/footer.png";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.5,
    paddingTop: 75, // 2.5 cm arriba
    paddingBottom: 56.693, // 2 cm abajo
    paddingLeft: 56.693, // 2 cm izquierda
    paddingRight: 28.3465, // 1 cm derecha
  },
  header: {
    // border: "1px dashed blue",
    fontSize: 10,
    textAlign: "center",
    marginBottom: 10,
    textTransform: "uppercase",
    fontWeight: "bold",
    padding: 1,
  },
  headerBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 71, // 2 cm
    // borderBottomWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  headerImage: {
    width: 447.63, // 15.8 cm en puntos
    height: 62.37, // 2.2 cm en puntos
  },
  footerBox2: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 56.693, // 2 cm
    // borderTopWidth: 1,
    borderColor: "#000",
    justifyContent: "center", // Centra horizontalmente
    alignItems: "center", // Centra verticalmente
    paddingVertical: 10,
  },
  image: {
    width: 453.54, // 16 cm
    height: 39.69, // 1.4 cm
  },
  pageNumberBox: {
    borderWidth: 1,
    borderColor: "green",
    position: "absolute",
    height: 20, // altura del borde superior
    bottom: 56.693, // justo arriba del footer (2cm)
    left: 250, // centrado manualmente
    width: 100, // ancho fijo para centrar mejor si se desea
    textAlign: "center",
    padding: 2,
    fontSize: 10,
    color: "#000",
    borderRadius: 4, // opcional: para que se vea más suave
  },
  bodyBox: {
    // border: "1px dashed red",
    padding: 10,
    marginBottom: 20,
  },
  content: {
    paddingBottom: 100, // espacio suficiente para no montar el contenido sobre el footer
    paddingHorizontal: 40,
  },

  container: {
    flexDirection: "row", // Disposición en fila para las columnas
    justifyContent: "space-between", // Espacio entre las columnas
    padding: 10, // Añade un poco de espacio alrededor
  },
  column: {
    // border: "1px dashed black",
    width: "48%", // Divide el ancho en dos columnas con un pequeño margen
    padding: 10,
  },
  footerBox: {
    marginBottom: 10, // Espacio inferior para el ejemplo
  },

  row: {
    flexDirection: "row",
    marginTop: 10,
    // border: "0px dashed red",
    marginBottom: 2,
  },
  label: {
    // border: "0px dashed black",
    fontWeight: "bold",
    display: "inline",
  },

  table: {
    display: "table",
    width: "100%",
    marginTop: 10,
  },
  tableCell: {
    // borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontSize: 10,
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signature: {
    marginTop: 30,
    flexDirection: "row", // ← alinear horizontalmente
    justifyContent: "space-around", // ← distribuir el espacio equitativamente
  },
  signatureBox: {
    width: "45%", // ← ocupar casi la mitad de la página
    textAlign: "center",
  },
});

const styleTContl = StyleSheet.create({
  tableCell: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});

const Header = () => (
  <View style={styles.headerBox} fixed>
    <Image style={styles.headerImage} src={headerLogo} />
  </View>
);
const PageNumber = () => (
  <Text
    style={styles.pageNumberBox}
    render={({ pageNumber, totalPages }) =>
      `Página ${pageNumber} de ${totalPages}`
    }
    fixed
  />
);



// const PageNumber = () => (
//   <Text style={styles.pageNumberBox} fixed>
//     1/1
//   </Text>
// );
const Footer = () => (
  <View style={styles.footerBox2} fixed>
    <Image style={styles.image} src={footerLogo} />
    <PageNumber />
  </View>
);


// data extraido del endpoint
const dataFilas = [
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  {
    codigoGameaDe: "149272",
    codigoGameaA: "149274",
    descripcion:
      "MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE RECTANGULAR MADERA\nMaterial: MADERA",
    rubro: "EQUIPO EDUCACIONAL Y RECREATIVO",
    serie: "25PRU",
    fechaIngreso: "04-may-2025",
  },
  
  
];
console.log(dataFilas);

const pageBreaks = [7, 18, 29]; // Saltos incondicionales
const conditionalBreaks = [
  { position: 4, maxLength: 7 },
  { position: 15, maxLength: 19 },
  { position: 26, maxLength: 29 }
];

const PDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header />

      {/* TITUTLO */}
      <Text style={styles.header}>
        ACTA DE VERIFICACIÓN E INCORPORACIÓN DE ACTIVOS{"\n"}Y ASIGNACIÓN DE
        CÓDIGOS
      </Text>
      {/* Tabla de Datos generales */}

      <View style={styles.bodyBox}>
        <View style={{ flexDirection: "row", position: "relative" }}>
          {/* Columna 1 y 2 (normales) */}
          <View style={{ width: "70%" }}>
            <View style={{ flexDirection: "row" }}>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>PROCEDENCIA:</Text>
                </Text>
              </View>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>COMPRA</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>PROVEEDOR:</Text>
                </Text>
              </View>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>TARCO SRL.</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>ORDEN DE COMPRA:</Text>
                </Text>
              </View>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text></Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>NOTA DE INGRESO:</Text>
                </Text>
              </View>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>3849</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>
                    UNIDAD SOLICITANTE:
                  </Text>
                </Text>
              </View>
              <View style={[styles.tableCell, { width: "50%" }]}>
                <Text>U.E.PUERTO DE H</Text>
              </View>
            </View>
          </View>

          {/* Columna 3 fusionada verticalmente */}
          {/* DOCUMENTADO y TELÉFONO (fuera de la mini tabla) */}
          <View style={{ paddingHorizontal: 4, marginBottom: 4 }}>
            <View style={[styles.tableCell, { width: "50%" }]}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>DOCUMENTADO:</Text>SI
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "50%" }]}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>TELEFONO:</Text>12345678
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.tableCell,
              {
                width: "30%",
                height: 150, // aumentamos un poco la altura
                position: "absolute",
                right: 0,
                bottom: 0,
                padding: 0,
                justifyContent: "flex-end",
              },
            ]}
          >
            {/* Mini tabla con solo bordes externos */}
            <View
              style={{
                display: "table",
                width: "100%",
                border: "1px solid #000",
              }}
            >
              {/* Fila 1: Título "IMPRESIÓN" */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "100%", padding: 4 }}>
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 9,
                    }}
                  >
                    IMPRESIÓN
                  </Text>
                </View>
              </View>

              {/* Fila 2: USUARIO */}
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: "50%",
                    padding: 4,
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: 9,
                    }}
                  >
                    USUARIO:
                  </Text>
                </View>
                <View style={{ width: "50%", padding: 4 }}>
                  <Text style={{ fontSize: 9 }}>rider.yanarico</Text>
                </View>
              </View>

              {/* Fila 3: FECHA */}
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: "50%",
                    padding: 4,
                    alignItems: "flex-end",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: 9,
                    }}
                  >
                    FECHA:
                  </Text>
                </View>
                <View style={{ width: "50%", padding: 4 }}>
                  <Text style={{ fontSize: 9 }}>04/may/2025</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* TABLA DE CONTENIDO */}

      <View style={{ flexDirection: "column", width: "100%" }}>
        {/* Fila principal (encabezados) */}
        <View style={{ flexDirection: "row", width: "100%" }}>
          {/* CODIGO GAMEA con subdivisión DE | A */}
          <View
            style={[styleTContl.tableCell, { width: "16.665%", padding: 0 }]}
          >
            <View style={{ width: "100%" }}>
              {/* Título */}
              <View
                style={{
                  width: "100%",
                  borderBottomWidth: 1,
                  borderColor: "#000",
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: 9,
                  }}
                >
                  CODIGO GAMEA
                </Text>
              </View>
              {/* Subfila DE | A con borde central */}
              <View style={{ flexDirection: "row", width: "100%" }}>
                <View
                  style={{
                    flex: 1,
                    borderRightWidth: 1,
                    borderColor: "#000",
                    paddingVertical: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ textAlign: "center", fontSize: 9 }}>DE</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ textAlign: "center", fontSize: 9 }}>A</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Otras columnas (Encabezados) */}
          <View style={[styleTContl.tableCell, { width: "40.7%" }]}>
            <Text
              style={{ fontWeight: "bold", textAlign: "center", fontSize: 9 }}
            >
              DESCRIPCIÓN
            </Text>
          </View>
          <View style={[styleTContl.tableCell, { width: "17.62%" }]}>
            <Text
              style={{ fontWeight: "bold", textAlign: "center", fontSize: 9 }}
            >
              RUBRO
            </Text>
          </View>
          <View style={[styleTContl.tableCell, { width: "12%" }]}>
            <Text
              style={{ fontWeight: "bold", textAlign: "center", fontSize: 9 }}
            >
              SERIE
            </Text>
          </View>
          <View style={[styleTContl.tableCell, { width: "13%" }]}>
            <Text
              style={{ fontWeight: "bold", textAlign: "center", fontSize: 9 }}
            >
              FECHA{"\n"}INGRESO
            </Text>
          </View>
        </View>
      </View>
      

      
        {/* Fila de datos */}
        {dataFilas.map((fila, index) => (
  <React.Fragment key={index}>
    {/* Fila de la tabla */}
    <View style={{ flexDirection: "column", width: "100%" }}>
      <View style={{ flexDirection: "row", width: "100%" }}>
        {/* CODIGO GAMEA (DE) */}
        <View
          style={[
            styleTContl.tableCell,
            {
              width: "8.3325%",
              padding: 0,
              borderWidth: 1,
              flexDirection: "row",
            },
          ]}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 4,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 8.5 }}>
              {fila.codigoGameaDe}
            </Text>
          </View>
        </View>

        {/* CODIGO GAMEA (A) */}
        <View
          style={[
            styleTContl.tableCell,
            {
              width: "8.3325%",
              padding: 0,
              borderWidth: 1,
              flexDirection: "row",
            },
          ]}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 4,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 8.5 }}>
              {fila.codigoGameaA}
            </Text>
          </View>
        </View>

        {/* DESCRIPCIÓN */}
        <View style={[styleTContl.tableCell, { width: "40.7%" }]}>
          <Text style={{ textAlign: "justify", fontSize: 7.5 }}>
            {fila.descripcion}
          </Text>
        </View>

        {/* RUBRO */}
        <View style={[styleTContl.tableCell, { width: "17.62%" }]}>
          <Text style={{ textAlign: "justify", fontSize: 8.5 }}>
            {fila.rubro}
          </Text>
        </View>

        {/* SERIE */}
        <View style={[styleTContl.tableCell, { width: "12%" }]}>
          <Text style={{ textAlign: "center", fontSize: 8.5 }}>
            {fila.serie}
          </Text>
        </View>

        {/* FECHA INGRESO */}
        <View style={[styleTContl.tableCell, { width: "13%" }]}>
          <Text style={{ textAlign: "center", fontSize: 8.5 }}>
            {fila.fechaIngreso}
          </Text>
        </View>
      </View>
    </View>

    {/* Salto de página según condiciones */}
    {(pageBreaks.includes(index + 1) || 
      conditionalBreaks.some(rule => index + 1 === rule.position && dataFilas.length < rule.maxLength)
    ) && index + 1 < dataFilas.length && (
      <View break />
    )}
  </React.Fragment>
))}





      
      <View style={{ flexDirection: "column", width: "100%" }}>
        <View
          style={[
            styleTContl,
            {
              borderWidth: 1,
              borderColor: "#000",
              textAlign: "left",
              minHeight: 40,
              padding: 4,
              width: "100%",
            },
          ]}
        >
          <Text
            style={{ fontWeight: "bold", textAlign: "left", fontSize: 8.5 }}
          >
            OBSERVACIONES:
          </Text>
        </View>
      </View>

      {/* firmas, totales, observaciones */}
      <View style={styles.container}>
        <View style={[styles.column, { textAlign: "left" }]}>
          <Text style={{ fontWeight: "bold" }}>TOTAL DE ACTIVOS: </Text>12
        </View>
        <View style={[styles.column, { textAlign: "right" }]}>
          <Text>El Alto, 04 de may de 2025</Text>
        </View>
      </View>
      <Text>
        {" "}
        {"\n"}
        {"\n"}
        {"\n"}{" "}
      </Text>
      <View style={styles.container}>
        <View style={[styles.column, { textAlign: "center" }]}>
          <Text style={{ fontWeight: "bold" }}>TECNICO VERIFICADOR</Text>
          {"\n"}
          <Text style={{ fontSize: 8.5 }}>
            SUSSY TICONA QUISPE{"\n"}
            4266519
          </Text>
        </View>
        <View style={[styles.column, { textAlign: "center" }]}>
          <Text style={{ fontWeight: "bold" }}>JEFE DE ACTIVOS FIJOS</Text>
        </View>
      </View>

      {/* Pre-footer con numeración automática */}
      <Footer fixed/>
    </Page>
  </Document>
);

export default PDF;

// const PDF = () => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.headerBox2}>
//         <Text>Este encabezado está fuera del margen</Text>
//       </View>

//       <View style={styles.headerBox}>
//         <Text style={styles.header}>
//           ACTA DE VERIFICACIÓN E INCORPORACIÓN DE ACTIVOS{"\n"}Y ASIGNACIÓN DE
//           CÓDIGOS
//         </Text>
//       </View>

//       <View style={styles.bodyBox}>
//         {/* Datos generales */}
//         <View style={styles.section}>
//           <View style={styles.row}>
//             <Text style={styles.label}>USUARIO:</Text>
//             <Text style={styles.value}>RIDER YANARICO</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>FECHA:</Text>
//             <Text style={styles.value}>04-MAY-2005</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>ORDEN DE COMPRA:</Text>
//             <Text style={styles.value}>2005341</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>NOTA DE INGRESO:</Text>
//             <Text style={styles.value}>3849</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>UNIDAD SOLICITANTE:</Text>
//             <Text style={styles.value}>U.E. PUERTO DE HUNIDAD</Text>
//           </View>
//           <View style={styles.row}>
//             <Text style={styles.label}>PROVEEDOR:</Text>
//             <Text style={styles.value}>TARCO SRL.</Text>
//           </View>
//         </View>

//         {/* Tabla de activos */}
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableHeader, { flex: 1 }]}>CÓDIGO</Text>
//             <Text style={[styles.tableHeader, { flex: 3 }]}>DESCRIPCIÓN</Text>
//             <Text style={[styles.tableHeader, { flex: 2 }]}>SERIE</Text>
//             <Text style={[styles.tableHeader, { flex: 2 }]}>FECHA INGRESO</Text>
//             <Text style={[styles.tableHeader, { flex: 2 }]}>RUBRO</Text>
//           </View>

//           {/* Activo 1 */}
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { flex: 1 }]}>149272</Text>
//             <Text style={[styles.tableCell, { flex: 3 }]}>
//               MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE - MADERA
//             </Text>
//             <Text style={[styles.tableCell, { flex: 2 }]}>149272 - 149274</Text>
//             <Text style={[styles.tableCell, { flex: 2 }]}>04-MAY-2005</Text>
//             <Text style={[styles.tableCell, { flex: 2 }]}>
//               EQUIPO EDUCACIONAL Y RECREATIVO
//             </Text>
//           </View>

//           {/* Activo 2 */}
//           <View style={styles.tableRow}>
//             <Text style={[styles.tableCell, { flex: 1 }]}>149275</Text>
//             <Text style={[styles.tableCell, { flex: 3 }]}>
//               SILLA 40X40X90 SECUNDARIA CAFE REJILLA MADERA
//             </Text>
//             <Text style={[styles.tableCell, { flex: 2 }]}>149275 - 149283</Text>
//             <Text style={[styles.tableCell, { flex: 2 }]}>04-MAY-2005</Text>
//             <Text style={[styles.tableCell, { flex: 2 }]}>
//               EQUIPO EDUCACIONAL Y RECREATIVO
//             </Text>
//           </View>
//         </View>
//       </View>

//       <View style={styles.footerBox}>
//         {/* Totales y fecha */}
//         <View style={styles.footer}>
//           <Text>Total de activos: 2</Text>
//           <Text>El Alto, 18 de marzo de 2025</Text>
//         </View>

//         {/* Firmas */}
//         <View style={styles.signature}>
//           <View style={styles.signatureBox}>
//             <Text>
//               TÉCNICO VERIFICADOR{"\n"}
//               SUSSY TICONA QUISPE
//             </Text>
//           </View>
//           <View style={styles.signatureBox}>
//             <Text>
//               JEFE DE ACTIVOS FIJOS{"\n"}
//               LIC. MARÍA FLORES
//             </Text>
//           </View>
//         </View>

//         {/* Observaciones */}
//         <View style={styles.observations}>
//           <Text>OBSERVACIONES:</Text>
//           <Text>Ninguna.</Text>
//         </View>
//       </View>

//       <View style={styles.footerBox2}>
//         <Text>Este pie de pagina está fuera del margen</Text>
//       </View>
//     </Page>
//   </Document>
// );

// export default PDF;

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 30,
    lineHeight: 1.5,
  },
  header: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  headerBox: {
    border: "0px dashed red",
    padding: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  bodyBox: {
    border: "1px dashed red",
    padding: 10,
    marginBottom: 20,
  },

  footerBox: {
    border: "0px dashed red",
    padding: 10,
    marginTop: 20,
  },

  section: {
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 2,
  },
  label: {
    width: "30%",
    fontWeight: "bold",
  },
  value: {
    width: "70%",
  },
  table: {
    display: "table",
    width: "100%",
    border: "1px solid #000",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#eee",
    fontWeight: "bold",
    padding: 4,
    borderRight: "1px solid #000",
  },
  tableCell: {
    padding: 4,
    borderRight: "1px solid #000",
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signature: {
    textAlign: "center",
    marginTop: 30,
  },
  observations: {
    marginTop: 10,
    borderTop: "1px solid #000",
    paddingTop: 5,
  },
});

const PDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerBox}>
        <Text style={styles.header}>
          ACTA DE VERIFICACIÓN E INCORPORACIÓN DE ACTIVOS Y ASIGNACIÓN DE
          CÓDIGOS
        </Text>
      </View>

      <View style={styles.bodyBox}>
        {/* Datos generales */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>USUARIO:</Text>
            <Text style={styles.value}>RIDER YANARICO</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>FECHA:</Text>
            <Text style={styles.value}>04-MAY-2005</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>ORDEN DE COMPRA:</Text>
            <Text style={styles.value}>2005341</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>NOTA DE INGRESO:</Text>
            <Text style={styles.value}>3849</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>UNIDAD SOLICITANTE:</Text>
            <Text style={styles.value}>U.E. PUERTO DE HUNIDAD</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>PROVEEDOR:</Text>
            <Text style={styles.value}>TARCO SRL.</Text>
          </View>
        </View>

        {/* Tabla de activos */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 1 }]}>CÓDIGO</Text>
            <Text style={[styles.tableHeader, { flex: 3 }]}>DESCRIPCIÓN</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>SERIE</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>FECHA INGRESO</Text>
            <Text style={[styles.tableHeader, { flex: 2 }]}>RUBRO</Text>
          </View>

          {/* Activo 1 */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>149272</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>
              MESA RECTANGULAR 120X80X60 SECUNDARIA CAFE - MADERA
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>149272 - 149274</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>04-MAY-2005</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              EQUIPO EDUCACIONAL Y RECREATIVO
            </Text>
          </View>

          {/* Activo 2 */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>149275</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>
              SILLA 40X40X90 SECUNDARIA CAFE REJILLA MADERA
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>149275 - 149283</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>04-MAY-2005</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              EQUIPO EDUCACIONAL Y RECREATIVO
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footerBox}>
        {/* Totales y fecha */}
        <View style={styles.footer}>
          <Text>Total de activos: 2</Text>
          <Text>El Alto, 18 de marzo de 2025</Text>
        </View>

        {/* Firmas */}
        <View style={styles.signature}>
          <Text>TÉCNICO VERIFICADOR</Text>
          <Text style={{ marginTop: 20 }}>SUSSY TICONA QUISPE</Text>
        </View>
        <View style={styles.signature}>
          <Text>JEFE DE ACTIVOS FIJOS</Text>
          <Text style={{ marginTop: 20 }}>LIC. MARÍA FLORES</Text>
        </View>

        {/* Observaciones */}
        <View style={styles.observations}>
          <Text>OBSERVACIONES:</Text>
          <Text>Ninguna.</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default PDF;

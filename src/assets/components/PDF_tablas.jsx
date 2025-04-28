// PDF_tablas.jsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet, 
  Image,
} from '@react-pdf/renderer';
import headerLogo from "../../assets/img/header.png";
import footerLogo from "../../assets/img/footer.png";

// Estilos para la tabla y texto
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  colSmall: {
    width: '10%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 4,
    textAlign: 'center',
  },
  col: {
    width: '30%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 4,
  },
  header: {
    backgroundColor: '#eee',
    fontWeight: 'bold',
  },
});

const Header = () => (
  <View style={styles.headerBox} fixed>
    <Image style={styles.headerImage} src={headerLogo} />
  </View>
);

const PDF = ({ estados }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Lista de Roles</Text>

      <View style={styles.table}>
        {/* Encabezado */}
        <View style={styles.tableRow}>
          <Text style={[styles.colSmall, styles.header]}>#</Text>
          <Text style={[styles.col, styles.header]}>Nombre</Text>
          <Text style={[styles.col, styles.header]}>Estado</Text>
          <Text style={[styles.col, styles.header]}>Creado</Text>
        </View>

        {/* Filas de datos */}
        {Array.isArray(estados) &&
          estados.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.colSmall}>{index + 1}</Text>
              <Text style={styles.col}>{item.name}</Text>
              <Text style={styles.col}>{item.state?.name || 'N/A'}</Text>
              <Text style={styles.col}>{item.created_at?.split('T')[0]}</Text>
            </View>
          ))}
      </View>
    </Page>
  </Document>
);

export default PDF;

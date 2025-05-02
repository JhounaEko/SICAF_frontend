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
    paddingTop: 85.039, // 2.5 cm arriba
    paddingBottom: 56.693, // 2 cm abajo
    paddingLeft: 56.693, // 2 cm izquierda
    paddingRight: 28.3465, // 1 cm derecha
  },
  title: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  colSmall: {
    width: "10%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 4,
    justifyContent: "center",
  },

  col: {
    width: "30%",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000",
    padding: 4,
    justifyContent: "center",
  },
  header: {
    fontSize: 10,
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    padding: 1,
  },
  headerBox: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 90, // 2 cm
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  headerImage: {
    width: 447.63, // 15.8 cm en puntos
    height: 60, // altura
  },
  footerBox2: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 56.693, // 2 cm
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

const Header = () => (
  <View style={styles.headerBox} fixed>
    <Image style={styles.headerImage} src={headerLogo} />
  </View>
);

const PageNumber = () => (
  <Text style={styles.pageNumberBox} fixed>
    1/1
  </Text>
);
const Footer = () => (
  <View style={styles.footerBox2} fixed>
    <Image style={styles.image} src={footerLogo} />
    <PageNumber />
  </View>
);

const PDF = ({ estados }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header />
      <Text style={styles.header}>
              {"\n"}SISTEMA DE INFORMACION 
            </Text>

      <View style={{ flexDirection: "row", position: "relative" }}>
        <View style={{ width: "70%", justifyContent: "center", alignItems: "center",}}>
          <Text style={styles.title}>Lista de Roles</Text>
        </View>

        <View style={{ width: "30%" }}>
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
      <Text>{"\n"}</Text>
      <View style={styles.table}>
        {/* CONTENIDO */}
        <View style={styles.tableRow}>
          <View style={styles.colSmall}>
            <Text style={styles.header}>Nro.</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.header}>Nombre</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.header}>Estado</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.header}>Creado</Text>
          </View>
        </View>

        {/* Filas de datos */}
        {Array.isArray(estados) &&
          estados.map((item, index) => (
            <View style={[styles.tableRow, { fontSize: 7.5 }]} key={index}>
              <View style={styles.colSmall}>
                <Text style={{ textAlign: "center" }}>{index + 1}</Text>
              </View>
              <View style={styles.col}>
                <Text>{item.name}</Text>
              </View>
              <View style={[styles.col, { textAlign: "center" }]}>
                <Text>{item.state?.name || "N/A"}</Text>
              </View>
              <View style={[styles.col, { textAlign: "center" }]}>
                <Text>{item.created_at?.split("T")[0]}</Text>
              </View>
            </View>
          ))}
      </View>

      <Footer fixed />
    </Page>
  </Document>
);

export default PDF;

// import React from 'react';
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   PanelHeader,
//   PanelFooter,
//   StyleSheet,
//   Image,
// } from '@react-pdf/renderer';
// import headerLogo from "../../assets/img/header.png";
// import footerLogo from "../../assets/img/footer.png";

// // Estilos para la tabla y texto
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 10,
//   },
//   title: {
//     fontSize: 16,
//     marginBottom: 20,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   table: {
//     display: 'table',
//     width: 'auto',
//     borderStyle: 'solid',
//     borderColor: '#000',
//     borderWidth: 1,
//     borderRightWidth: 0,
//     borderBottomWidth: 0,
//   },
//   tableRow: {
//     flexDirection: 'row',
//   },
//   colSmall: {
//     width: '10%',
//     borderStyle: 'solid',
//     borderColor: '#000',
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     padding: 4,
//     textAlign: 'center',
//   },
//   col: {
//     width: '30%',
//     borderStyle: 'solid',
//     borderColor: '#000',
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     padding: 4,
//   },
//   header: {
//     backgroundColor: '#eee',
//     fontWeight: 'bold',
//   },
// });

// const Header = () => (
//   <View style={styles.headerBox} fixed>
//     <Image style={styles.headerImage} src={headerLogo} />
//   </View>
// );

// const PDF = ({ estados }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.title}>Lista de Roles</Text>

//       <View style={styles.table}>
//         {/* Encabezado */}
//         <View style={styles.tableRow}>
//           <Text style={[styles.colSmall, styles.header]}>#</Text>
//           <Text style={[styles.col, styles.header]}>Nombre</Text>
//           <Text style={[styles.col, styles.header]}>Estado</Text>
//           <Text style={[styles.col, styles.header]}>Creado</Text>
//         </View>

//         {/* Filas de datos */}
//         {Array.isArray(estados) &&
//           estados.map((item, index) => (
//             <View style={styles.tableRow} key={index}>
//               <Text style={styles.colSmall}>{index + 1}</Text>
//               <Text style={styles.col}>{item.name}</Text>
//               <Text style={styles.col}>{item.state?.name || 'N/A'}</Text>
//               <Text style={styles.col}>{item.created_at?.split('T')[0]}</Text>
//             </View>
//           ))}
//       </View>
//     </Page>
//   </Document>
// );

// export default PDF;

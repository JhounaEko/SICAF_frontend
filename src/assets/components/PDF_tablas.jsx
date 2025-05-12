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

// MOD GET datos de secion
import Cookies from "js-cookie"; // datos de secion
const dataUser = Cookies.get(process.env.REACT_APP_COOKIES_NAME_DATA);
let parsedUser = JSON.parse(dataUser);
// console.log("Datos SECION",parsedUser.first_name, parsedUser.last_name);
// FIN MOD GET datos secion

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
    fontSize: 13,
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
    flexWrap: "nowrap",
    minWidth: 0,
    alignItems: "stretch",
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
    width: "30%",// Ajusta esto según tus necesidades
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
});

const Header = () => (
  <View style={styles.headerBox} fixed>
    <Image style={styles.headerImage} src={headerLogo} />
  </View>
);

const PageNumber = () => (
  <Text style={styles.pageNumberBox} fixed>
    {/* 1/1 */}
  </Text>
);
const Footer = () => (
  <View style={styles.footerBox2} fixed>
    <Image style={styles.image} src={footerLogo} />
    <PageNumber />
  </View>
);        

const PDF = ({ data, titulo, columnas }) => (
  
  <Document title={"REPORTE DE "+titulo}>
    <Page size="A4" orientation="landscape" style={styles.page}>
        {/* <Page
          size="A4"
          // orientation={titulo === '' ? undefined : 'landscape'}
          style={styles.page}
        > */}

      <Header />
      <Text style={styles.header}>{"\n"}SISTEMA DE INFORMACION Y CONTROL DE ACTIVOS FIJOS</Text>

      <View style={{ flexDirection: "row", position: "relative" }}>
        <View
          style={{
            width: "70%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>LISTA DE {titulo}</Text>
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
                <Text style={{ fontSize: 8 }}>
                  {parsedUser.first_name} {parsedUser.last_name}
                </Text>
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
                <Text style={{ fontSize: 9 }}>
                  <Text>{`${new Date()
                    .getDate()
                    .toString()
                    .padStart(2, "0")}/${new Date()
                    .toLocaleString("es-ES", { month: "short" })
                    .toLowerCase()}/${new Date().getFullYear()}`}</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <Text>{"\n"}</Text>
      <View style={styles.table}>
        {/* CONTENIDO */}
        {/* CABEZERA */}
<View style={styles.tableRow}>
  {Array.isArray(columnas) &&
    columnas.slice(0, -1).map((text, index) => (
      <View style={index === 0 ? styles.colSmall : styles.col} key={index}>
        <Text style={styles.header}>{text.children}</Text>
      </View>
    ))}
</View>

{/* //////////////////////////////////////////////////////////////////// */}
        {/* Filas de datos */}

        {Array.isArray(data) &&
          data.map((item, index) => (

            <View style={[styles.tableRow, { fontSize: 7.5 }]} key={index}>

              <View style={styles.colSmall}>
                <Text style={{ textAlign: "center" }}>{index + 1}</Text>
              </View>

{/* CASO LUGAR */}
              <View style={styles.col}>
                <Text>{item.code}</Text>
              </View>

              <View style={styles.col}>
                <Text>{item.description || item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim()}</Text>
              </View>
{/* //////////////////// */}
              
              <View style={styles.col}>
                <Text>{item.abbreviation}</Text>
              </View>
              <View style={[styles.col, { textAlign: "center" }]}>
                <Text>{item.created_at?.split("T")[0]}</Text>
              </View>
              <View style={styles.col}>
                <Text>{item.details}</Text>
              </View>

{/* CASO CARGO */}
              {/* <View style={styles.col}>
                <Text>{item.description}</Text>
              </View> */}

{/* CASO USUARIO */}
              {/* <View style={styles.col}>
                <Text>{item.office.name}</Text>
              </View>
              <View style={styles.col}>
                <Text>{item.position.name}</Text>
              </View> */}

{/* VACIO CASO PERMISOS */}
              {/* <View style={styles.col}>
                <Text>{item.initials}</Text>
              </View>
              <View style={styles.col}>
                <Text>{item.level}</Text>
              </View>

              <View style={styles.col}>
                <Text>{item.permissions.length}</Text>
              </View>

              <View style={styles.col}>
                <Text>{item.username}</Text>
              </View>
              <View style={styles.col}>
                <Text>{item.office.name}</Text>
              </View>
              <View style={styles.col}>
                {Array.isArray(item.roles) &&
                  item.roles.map((role, index) => (
                    <Text key={index}>{role.name}</Text>
                  ))}
              </View> */}
{/* //////////////////// */}
{/* SE ESCONDE PARA CASO LUGARES */}
              {/* <View style={[styles.col, { textAlign: "center" }]}>
                <Text>{item.created_at?.split("T")[0]}</Text>
              </View> */}
              {/* se esconde para caso OFICINAS */}
              <View style={[styles.col, { textAlign: "center" }]}>
                <Text>{item.updated_at?.split("T")[0]}</Text>
              </View>

              <View style={[styles.col, { textAlign: "center" }]}>
                <Text>{item.state.name}</Text>
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

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image, } from "@react-pdf/renderer";
import headerLogo from "./../../../assets/img/header.png";
import footerLogo from "../../../assets/img/footer.png";
import UserPdf from './usuario-pdf.jsx';
import styles from './style-tabla.jsx';

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

/** Permite mostrar los datos del objeto en base a atributos 'name.state' */
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}
let indexPag = 0;  // referencia otras paginas
let currentPage = 0; // contador para la primera pagina

const PDF = ({ data, titulo, columnas, styleFontSize,styleWightCell, atributosData, numRowFirtPage, numRowotherPage }) => (
  <Document title={"REPORTE DE " + titulo}>
    <Page
      size="A4"
      orientation={["PERMISOS", "OFICINAS", "ROLES", "CARGOS"].includes(titulo) ? undefined : "landscape"}
      style={styles.page}>
      <Header />

      <Text style={styles.header}>  {"\n"}SISTEMA DE INFORMACION Y CONTROL DE ACTIVOS FIJOS </Text>
      <Text style={styles.title}>LISTA DE {titulo}</Text>

      <UserPdf />
      <Text>{"\n"}</Text>
      <View style={styles.table}>
          {/* CABEZERA */}
          <View style={[styles.tableRow, { fontSize: 8, fontWeight: 'bold', backgroundColor: '#e0e0e0' }]}>
            {columnas.map((col, i) => {
              return (<View style={[styles.col, styleWightCell[i]]} key={"firt_header"+i}>
                <Text style={[{textAlign: "center", textTransform: "uppercase" },styleFontSize[i]]}>{col}</Text>
              </View>);
            })
            }
          </View>
        
          {data.length > 0 ?
            data.map((item, index) => {

              if (index % (numRowFirtPage+1) === 0) {
                currentPage++;
              }

              /*** Registros para la primera pagina */
              if (currentPage == 1) {
                indexPag = index;
                return (<React.Fragment key={index}>
                  {/** Cabezera para salto de pagina */}
                  {(index > 0 && (index) == numRowFirtPage)&&
                    <View style={[styles.tableRow, { fontSize: 8, fontWeight: 'bold', backgroundColor: '#e0e0e0' }]} break={index > 0 && (index) % numRowFirtPage === 0}>
                      {columnas.map((col, i) => {
                        return (<View style={[styles.col, styleWightCell[i]]} key={"header" + i}>
                          <Text style={[{ textAlign: "center", textTransform: "uppercase" },styleFontSize[i]]}>{col}</Text>
                        </View>);
                      })
                      }
                    </View>
                  }

                  {/** Fila de datos para la pagina */}
                  {<View style={[styles.tableRow, { fontSize: 7.5 }]} key={index} >
                    {(atributosData).map((col, i) => {
                      return (<View style={[styles.col, styleWightCell[i]]} key={i+999}>
                        <Text style={[{ textAlign: "center" },styleFontSize[i]]}>{(col == 'id') ? (index + 1) : getNestedValue(item, col)}</Text>
                      </View>);
                    })}
                  </View>}
                </React.Fragment>)
              /*** Registros para la otras pagina */
              } else {
                return (
                  <React.Fragment key={index}>
                    {/** Cabezera para salto de pagina */}
                    {(index - indexPag) % numRowotherPage === 0 &&
                      <View style={[styles.tableRow, { fontSize: 8, fontWeight: 'bold', backgroundColor: '#e0e0e0' }]} break={index > 0 && (index - indexPag) % numRowotherPage === 0}>
                        {columnas.map((col, i) => {
                          return (<View style={[styles.col, styleWightCell[i]]} key={"header" + i}>
                            <Text style={[{ textAlign: "center", textTransform: "uppercase" },styleFontSize[i]]}>{col}</Text>
                          </View>);
                        })
                        }
                      </View>
                    }
                    {/** Fila de datos para la pagina */}
                    <View style={[styles.tableRow, { fontSize: 7.5 }]} key={"rown" + index} >
                      {(atributosData).map((col, i) => {
                        return (<View style={[styles.col, styleWightCell[i]]} key={"pn" + i}>
                          <Text style={[{ textAlign: "center" },styleFontSize[i]]}>{(col == 'id') ? (index + 1) : getNestedValue(item, col)}</Text>
                        </View>);
                      })}
                    </View>
                  </React.Fragment>
                );
              }

            }) :
            <View style={[{ fontSize: 7.5 }]}>
              <Text style={{ width: "100%", textAlign: "center", borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#000", padding: 4, justifyContent: "center" }}>Sin datos</Text>
            </View>
          }
      </View>
      <Footer fixed />
    </Page>
  </Document>
);
export default PDF;

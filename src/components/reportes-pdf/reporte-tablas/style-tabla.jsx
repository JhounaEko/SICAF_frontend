import { StyleSheet,} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    lineHeight: 1.5,
    paddingTop: 85.039, // 2.5 cm arriba
    paddingBottom: 68.80, // 2.25 cm abajo
    paddingLeft: 28.3465, // 2 cm izquierda
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
   // borderWidth: 1,
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
   // width: "10%",
    borderWidth: 0.5,
   // borderBottomWidth: 1,
    borderColor: "#000",
    padding: 4,
    justifyContent: "center",
  },

  col: {
  //  width: "30%", // Ajusta esto según tus necesidades
    borderWidth: 0.5,
//borderBottomWidth: 1,
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
    width: 450, // ancho
    height: 790, // altura
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
    // imagen footer
    width: 550,
    sheight: 55,
  },
  pageNumberBox: {
    borderColor: "green",
    position: "absolute",
    height: 25, // altura del borde superior
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
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

 
export default styles;
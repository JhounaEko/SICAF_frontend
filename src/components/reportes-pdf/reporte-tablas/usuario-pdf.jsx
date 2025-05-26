import { Text, View, } from "@react-pdf/renderer";
import Cookies from "js-cookie";
import Swal from 'sweetalert2';
/** Se utiliza para mostrar los datos del usuario que genero el reporte */
const UserPdf = () => {

    const dataUser = Cookies.get(process.env.REACT_APP_COOKIES_NAME_DATA);
    let parsedUser = null;
    if (!dataUser) {   
        Swal.fire({
            title: "Sesion finalizada",
            icon: "success",
            draggable: true,
            timer: 3000,
            confirmButtonColor: "#3085d6",
        });
        window.location.href = "/";
        return;
    } else {
        parsedUser = JSON.parse(dataUser);
    }
 
    return (

        <View style={{ width: '100%', alignItems: 'flex-end' }}>
            <View style={{ display: "table", width: "30%", border: "0.5px solid #000", borderRadius: 3 }} >
                {/* Fila 2: IMPRESIÓN */}
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "100%", padding: 4 }}>
                        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 9, }}>
                            IMPRESIÓN
                        </Text>
                    </View>
                </View>
                {/* Fila 2: USUARIO */}
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "50%", padding: 3, alignItems: "flex-end", }} >
                        <Text style={{ textAlign: "right", fontWeight: "bold", fontSize: 9, }}>
                            USUARIO:
                        </Text>
                    </View>
                    <View style={{ width: "50%", padding: 3 , alignItems: "flex-start", }}>
                        <Text style={{ fontSize: 8 }}>
                            {parsedUser.first_name} {parsedUser.last_name}
                        </Text>
                    </View>
                </View>
                {/* Fila 3: FECHA */}
                <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "50%", padding: 4, alignItems: "flex-end" }} >
                        <Text style={{ textAlign: "right", fontWeight: "bold", fontSize: 9 }}>
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
                                    .toLowerCase()}/${new Date().getFullYear()}`
                            }</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default UserPdf; 
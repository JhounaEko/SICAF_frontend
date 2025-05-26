

import { Store } from 'react-notifications-component';
import Swal from 'sweetalert2';

export function addNotification(notificationType, notificationTitle, notificationMessage, notificationPosition, duration, icon, notificationContent) {
  Store.addNotification({
    title: notificationTitle,
    message: (
      <div>
        <i className={icon} style={{ fontSize: '25px', marginRight: '10px' }}></i> {notificationMessage}
      </div>
    ),
    type: notificationType,
    insert: "top",
    container: notificationPosition,
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 8000,
    },
    content: notificationContent
  });
}

export const messageFinallySesion = () => {
  Swal.fire({
    title: "Sesion finalizada",
    icon: "success",
    draggable: true,
    timer: 3000,
    confirmButtonColor: "#3085d6",
  });
}

export const messageRegisterDataSuccess = () => {
  Swal.fire({
                    title: "Registro exitoso",
                    icon: "success",
                    draggable: true,
                    timer: 3000,
                    confirmButtonColor: "#3085d6",
                });
}

export const messageUpdateDataSuccess = () => {
 Swal.fire({
                    title: "Datos actualizado correctamente",
                    icon: "success",
                    draggable: true,
                    timer: 3000,
                    confirmButtonColor: "#3085d6",
                });
}

export const messageUpdateStatusRowSuccess = () => {
 Swal.fire({
                title: "Se establecio el cambio de estado correctamente",
                text: "",
                icon: "success",
                draggable: true,
                timer: 3000,
                confirmButtonColor: "#3085d6",
            });
}


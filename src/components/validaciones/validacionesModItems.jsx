/** Ingreso de nota */
export const validacionesNota = {
    required: "El campo es obligatorio",
    pattern: {       
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s/-]+$/u,
        message: "Solo se permiten números, letras, guiones y la barra '/'",
    },
}

export const validacionesReciboPago = {
    required: "El campo es obligatorio",
    pattern: {       
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s/-]+$/u,
        message: "Solo se permiten números, letras, guiones y la barra '/'",
    },
}

export const validacionesReciboGastos = {
    required: "El campo es obligatorio",
     pattern: {       
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s/-]+$/u,
        message: "Solo se permiten números, letras, guiones y la barra '/'",
    },
}

export const validacionesBoicher = {
    required: "El campo es obligatorio",
      pattern: {       
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s/-]+$/u,
        message: "Solo se permiten números, letras, guiones y la barra '/'",
    },
}

export const validacionesNumeroCantidadDfm = {
    required: "El campo es obligatorio",
    pattern: {
        value: /^\d+(\.\d{1,2})?$/,
        message: "Debe ser un número válido con hasta 2 decimales",
    },
}
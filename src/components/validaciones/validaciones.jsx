/*** Se utiliza para los usuarios */
export const validacionesFirstName = {
    required: "El campo es obligatorio",
    pattern: {
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u,
        message: "El nombre solo puede contener letras",
    },
    maxLength: {
        value: 30,
        message: "El nombre no puede tener más de 30 caracteres",
    },
};

export const validacionesLastName = {
    required: "El campo es obligatorio",
    pattern: {
        value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u,
        message: "El nombre solo puede contener letras, tildes, espacios, y los caracteres ' y -",
    },
    maxLength: {
        value: 30,
        message: "El nombre no puede tener más de 30 caracteres",
    },
}

export const validacionesCI = {
    required: "Campo obligatorio",
    minLength: {
        value: 6,
        message: "Min. 6 carac.",
    },
    maxLength: {
        value: 8,
        message: "Max. 8 carac.",
    },
    pattern: {
        value: /^[1-9]\d*$/,
        message: "Formato no válido",
    },
}

export const separarValorCiComplemento =(valor) => {
    let ciComplemento = '';
    let numCi = valor;

    if (valor.includes('-')) {
        const partes = valor.split('-');
        numCi = partes[0];
        ciComplemento = partes[1];
    }

    return { ciComplemento, numCi };
}

export const validacionesComplementoCi = {
    validate: value =>
        !value || /^\d{1,2}[A-Za-z]$/.test(value) || "Formato inválido.",
    maxLength: {
        value: 3,
        message: "Máx. 3 caracteres.",
    }
}

export const validacionesCelular = {
    required: "El número de celular es obligatorio",
    pattern: {
        value: /^(6|7)[0-9]{7}$/,
        message: "El número de teléfono debe comenzar con 6 o 7 y tener 8 dígitos en total",
    },
    maxLength: {
        value: 8,
        message: "El número de teléfono no puede tener más de 8 caracteres",
    },
}

export const validacionesEmail = {
    required: "El correo electrónico es obligatorio",
    pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "El correo electrónico no tiene un formato válido",
    },
}

export const validacionesDescripcion = {
    required: "El campo es obligatorio",
    pattern: {
        value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s'’°#.-]+$/u,
        message: "Solo se permiten letras, números y algunos símbolos como -, ', °, # y puntos.",
    },
    maxLength: {
        value: 100,
        message: "El campo no puede tener más de 100 caracteres",
    },
}

export const validacionesCodigo = {
    required: "El campo es obligatorio",
    pattern: {
        value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s'’°#.-]+$/u,
        message: "Solo se permiten letras, números y algunos símbolos como -, ', °, # y puntos.",
    },
    maxLength: {
        value: 12,
        message: "El campo no puede tener más de 12 caracteres",
    },
}

export const validacionesAbreviacion = {
    required: "El campo es obligatorio",
    pattern: {
        value: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s'’°#.-]+$/u,
        message: "Solo se permiten letras, números y algunos símbolos como -, ', °, # y puntos.",
    },
    maxLength: {
        value: 12,
        message: "El campo no puede tener más de 12 caracteres",
    },
}
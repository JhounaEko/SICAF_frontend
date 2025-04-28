/*** Se utiliza para los usuarios */
export const validacionesFirstName = {
    required: "El campo es obligatorio",
    pattern: {
      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/u,
      message: "El nombre solo puede contener letras, tildes, espacios, y los caracteres ' y -",
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
    required: "Campo obligatoria",
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
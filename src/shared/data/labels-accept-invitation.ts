const LABELS_ACCEPT_INVITATION = {
  title: "Aceptar invitación",
  description:
    "Define tu contraseña para activar la cuenta. Luego podrás iniciar sesión.",
  missingToken:
    "El enlace de invitación no es válido o está incompleto. Solicita uno nuevo.",
  fields: {
    password: {
      label: "Contraseña",
      placeholder: "Mínimo 8 caracteres",
      required: "La contraseña es obligatoria",
      min: "La contraseña debe tener al menos 8 caracteres",
    },
    confirmPassword: {
      label: "Confirmar contraseña",
      placeholder: "Repite la contraseña",
      required: "Confirma la contraseña",
      mismatch: "Las contraseñas no coinciden",
    },
    phone: {
      label: "Teléfono (opcional)",
      placeholder: "+56 9 1234 5678",
    },
  },
  submit: "Crear cuenta",
  submitting: "Creando cuenta…",
  successRedirect: "Cuenta creada. Ya puedes iniciar sesión.",
  goToLogin: "Ir a iniciar sesión",
  showPassword: "Mostrar contraseña",
};

export default LABELS_ACCEPT_INVITATION;

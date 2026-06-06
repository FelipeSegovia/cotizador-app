const LABELS_RECOVER_PASSWORD = {
  step1: {
    title: "Recuperar contraseña",
    description:
      "Ingresa tu correo electrónico y te enviaremos un código de verificación.",
    labelEmail: "Correo electrónico",
    placeholderEmail: "nombre@empresa.cl",
    submitButton: "Enviar código",
  },
  step2: {
    title: "Verificar código",
    description:
      "Ingresa el código de 6 dígitos que enviamos a tu correo electrónico.",
    labelCode: "Código de verificación",
    placeholderCode: "123456",
    submitButton: "Verificar código",
  },
  step3: {
    title: "Nueva contraseña",
    description: "Ingresa y confirma tu nueva contraseña.",
    labelNewPassword: "Nueva contraseña",
    labelConfirmPassword: "Confirmar contraseña",
    placeholderPassword: "••••••••••",
    submitButton: "Restablecer contraseña",
    success: "Contraseña restablecida correctamente. Ya puedes iniciar sesión.",
  },
  backToLogin: "Volver al login",
  requiredField: {
    email: "El correo electrónico es obligatorio",
    code: "El código es obligatorio",
    password: "La contraseña es obligatoria",
    confirmPassword: "Debes confirmar la contraseña",
  },
  errorField: {
    email: "Ingresa un correo electrónico válido",
    code: "El código debe tener 6 dígitos",
    password: "Debe tener al menos 8 caracteres",
    mismatch: "Las contraseñas no coinciden",
  },
};

export default LABELS_RECOVER_PASSWORD;

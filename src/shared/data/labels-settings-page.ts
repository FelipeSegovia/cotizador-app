const LABELS_SETTINGS_PAGE = {
  pageTitle: "Configuración",
  pageSubtitle:
    "Administra los datos de tu cuenta y la información de tu empresa para las cotizaciones y documentos PDF.",
  profileCard: {
    title: "Perfil personal",
    hint:
      "Puedes actualizar tu nombre y teléfono. El correo y el identificador no se pueden cambiar desde aquí.",
    saveButton: "Guardar cambios",
    saving: "Guardando…",
    saveSuccess: "Perfil actualizado correctamente.",
    fields: {
      name: {
        label: "Nombre completo",
        required: "El nombre es obligatorio",
      },
      email: { label: "Correo electrónico" },
      mobilePhone: { label: "Teléfono de contacto" },
      userId: { label: "Identificador de usuario" },
    },
  },
  companyCard: {
    title: "Datos de la empresa",
    footerNote:
      "Estos datos aparecerán en las cotizaciones y se usan al generar el PDF (requiere empresa configurada).",
    fields: {
      name: {
        label: "Razón social",
        placeholder: "Ej: Servicios de Tecnología SpA",
        required: "La razón social es obligatoria",
      },
      rut: {
        label: "RUT (Chile)",
        placeholder: "12.345.678-9",
        required: "El RUT es obligatorio",
      },
      address: {
        label: "Dirección comercial",
        placeholder: "Calle, número, oficina…",
      },
      city: {
        label: "Ciudad",
        placeholder: "Ej: Santiago",
      },
      contact: {
        label: "Contacto",
        placeholder: "Teléfono o correo de contacto",
      },
    },
    ivaInfo: {
      title: "IVA en documentos",
      body:
        "El PDF de cotización aplica IVA 19% sobre el monto neto persistido, según la lógica del sistema.",
    },
    saveButton: "Guardar cambios",
    saving: "Guardando…",
    saveSuccess: "Datos guardados correctamente.",
    loadError: "No se pudo cargar la empresa.",
  },
  infoTiles: {
    security: {
      title: "Seguridad",
      body: "Tu conexión usa HTTPS y autenticación con token (JWT) en las solicitudes al API.",
    },
    lastUpdate: {
      title: "Último cambio",
      bodyWithDate: "La ficha de empresa se actualizó por última vez el {date}.",
      bodyPending: "Aún no hay empresa guardada. Completa el formulario y guarda.",
    },
    pdf: {
      title: "PDF y empresa",
      body:
        "Para descargar el PDF de una cotización debe existir un registro de empresa (PUT /api/company).",
    },
  },
  loadingUser: "Cargando perfil…",
  loadingCompany: "Cargando datos de empresa…",
};

export default LABELS_SETTINGS_PAGE;

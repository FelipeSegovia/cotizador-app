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
      logo: {
        label: "Logo de la empresa",
        hint: "Formatos permitidos: JPG, JPEG, PNG o SVG. Tamaño máximo: 2 MB.",
        uploadButton: "Subir logo",
        changeButton: "Cambiar logo",
        invalidType: "El archivo debe ser una imagen JPG, JPEG, PNG o SVG.",
        maxSize: "El archivo no puede superar los 2 MB.",
        alt: "Logo de la empresa",
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
  termsCard: {
    title: "Términos y Condiciones",
    description:
      "Estos ítems aparecen en la previsualización de cotizaciones y en el PDF generado.",
    footerNote:
      "Puedes agregar, editar, eliminar y reordenar cada término. Los cambios se aplican a todas las cotizaciones futuras.",
    fields: {
      term: {
        placeholder: "Escribe un término o condición…",
        required: "El término no puede estar vacío",
      },
    },
    addButton: "Agregar término",
    dragHandle: "Arrastrar para reordenar",
    remove: "Eliminar",
    emptyList: "No hay términos configurados. Agrega al menos uno.",
    saveButton: "Guardar términos",
    saving: "Guardando…",
    saveSuccess: "Términos y condiciones guardados correctamente.",
    loadError: "No se pudieron cargar los términos y condiciones.",
    validation: {
      minOne: "Debe existir al menos un término con contenido.",
    },
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
  loadingTerms: "Cargando términos y condiciones…",
};

export default LABELS_SETTINGS_PAGE;

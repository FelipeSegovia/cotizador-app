const LABELS_QUOTATION_PAGE = {
  breadcrumb: {
    list: "Cotizaciones",
    createNew: "Crear Nueva",
  },
  title: "Generador",
  actions: {
    discardDraft: "Descartar Borrador",
    saveAndPreview: "Guardar y Previsualizar",
    sendToClient: "Enviar al Cliente",
  },
  clientSection: {
    title: "Informacion del Cliente",
    fields: {
      clientName: {
        label: "Nombre",
        placeholder: "ej. Constructora Andes S.A.",
        required: "El nombre del cliente es obligatorio",
      },
      clientRut: {
        label: "RUT",
        placeholder: "76.123.456-K",
        required: "El RUT es obligatorio",
      },
      clientEmail: {
        label: "Email",
        placeholder: "facturacion@constructoraandes.cl",
        required: "El email es obligatorio",
        invalid: "Ingresa un email valido",
      },
    },
  },
  projectSection: {
    title: "Detalles del Proyecto",
    fields: {
      projectTitle: {
        label: "Nombre del Proyecto",
        placeholder: "Renovacion Interior - Fase 1",
        required: "El nombre del proyecto es obligatorio",
      },
      projectDeadline: {
        label: "Fecha Estimada de Entrega",
      },
      projectNotes: {
        label: "Descripcion / Notas Internas",
        placeholder: "Detalles adicionales sobre el alcance del trabajo...",
      },
    },
  },
  itemsSection: {
    title: "Lista de Items",
    addItem: "Agregar Item",
    removeItemAriaLabel: "Eliminar item",
    columns: {
      description: "Descripcion",
      unitPrice: "Precio Unitario",
      quantity: "Cantidad",
      total: "Total",
    },
    placeholders: {
      description: "Descripcion del servicio",
      unitPrice: "0",
      quantity: "1",
    },
  },
  summary: {
    title: "Resumen de Cotizacion",
    subtotal: "Subtotal",
    iva: "IVA (19%)",
    total: "Total Final",
    currency: "Moneda: CLP (Peso Chileno)",
    status: "Estado: Borrador",
    statusMessage: "Listo para revision y aprobacion",
  },
  quickHelp: {
    title: "Ayuda Rapida",
    tips: [
      "Los valores se calculan automaticamente en CLP.",
      "La validacion del RUT se realiza al guardar.",
      "La vista previa en PDF se generara automaticamente.",
    ],
  },
};

export default LABELS_QUOTATION_PAGE;

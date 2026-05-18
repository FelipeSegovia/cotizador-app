const LABELS_QUOTATION_PREVIEW_PAGE = {
  topBar: {
    backToList: "Volver al Listado",
    draftBadge: "Borrador",
    sentBadge: "Enviada",
    approvedBadge: "Aprobada",
    rejectedBadge: "Rechazada",
    expiredBadge: "Expirado",
    backToEdit: "Volver a Editar",
    downloadPdf: "Descargar PDF",
    downloadPdfLoading: "Generando PDF…",
    sendQuotation: "Enviar Cotizacion",
    readOnlyInfo: "Vista en modo solo lectura",
    approveQuotation: "Marcar como Aprobada",
    rejectQuotation: "Marcar como Rechazada",
    updatingStatus: "Actualizando estado…",
  },
  statusUpdate: {
    successApproved: "La cotización fue marcada como Aprobada.",
    successRejected: "La cotización fue marcada como Rechazada.",
    errorGeneric: "No se pudo actualizar el estado de la cotización.",
    expiredInfo:
      "La cotización ya expiró (su fecha de validez pasó) y no puede cambiar de estado.",
  },
  pdfFeedback: {
    success:
      "El PDF de la cotizacion se genero y envio correctamente al servidor.",
    errorNoSavedId:
      "Guarda la cotizacion antes de descargar el PDF para tener un identificador en el sistema.",
    errorGeneric: "No se pudo completar la solicitud del PDF. Intenta de nuevo.",
  },
  document: {
    title: "Cotizacion",
    emissionDate: "Fecha de Emision",
    validUntil: "Valido hasta",
    quoteNumber: "#001",
  },
  summary: {
    client: "Cliente",
    projectSummary: "Resumen del Proyecto",
    tableHeaders: {
      description: "Descripcion",
      quantity: "Cant.",
      unitPrice: "Precio Unit.",
      total: "Total",
    },
    totals: {
      subtotal: "Subtotal",
      iva: "IVA (19%)",
      total: "TOTAL",
    },
  },
  terms: {
    title: "Terminos y Condiciones",
  },
  footer: {
    signature: "Firma Aceptacion Cliente",
    generatedBy: "Documento generado electronicamente por",
    generatedByWithoutCompany:
      "Documento generado electronicamente (configura tu empresa en Ajustes para personalizar este texto).",
  },
  company: {
    loading: "Cargando datos de la empresa…",
    loadError:
      "No se pudieron obtener los datos de la empresa. Revisa tu conexion e intenta de nuevo.",
    notConfigured:
      "Aun no has configurado los datos de tu empresa. Ve a Ajustes para que aparezcan aqui y en el PDF.",
  },
};

export default LABELS_QUOTATION_PREVIEW_PAGE;

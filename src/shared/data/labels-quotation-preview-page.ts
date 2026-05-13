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
    sendQuotation: "Enviar Cotizacion",
    readOnlyInfo: "Vista en modo solo lectura",
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

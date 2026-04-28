const LABELS_QUOTATIONS_LIST_PAGE = {
  title: "Cotizaciones",
  subtitle: "Gestiona y da seguimiento a tus cotizaciones",
  draftEditInfo:
    "Las cotizaciones en estado Borrador pueden editarse; Enviada y Aprobada solo permiten previsualizacion.",
  newQuotationButton: "Nueva Cotización",
  loading: "Cargando cotizaciones...",
  loadError: "Error al cargar las cotizaciones. Intenta de nuevo.",
  emptyState: {
    title: "No hay cotizaciones aun.",
    action: "Crear Primera Cotización",
  },
  table: {
    number: "#",
    client: "Cliente",
    project: "Proyecto",
    status: "Estado",
    total: "Total",
    date: "Fecha",
    action: "Ver",
    actionEditDraft: "Editar",
    actionViewPreview: "Ver",
  },
  statusLabels: {
    draft: "Borrador",
    sent: "Enviada",
    approved: "Aprobada",
    rejected: "Rechazada",
  },
};

export default LABELS_QUOTATIONS_LIST_PAGE;

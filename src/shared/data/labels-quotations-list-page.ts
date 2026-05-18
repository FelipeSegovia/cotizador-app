const LABELS_QUOTATIONS_LIST_PAGE = {
  title: "Cotizaciones",
  subtitle: "Gestiona y da seguimiento a tus cotizaciones",
  draftEditInfo:
    "Las cotizaciones en estado Borrador pueden editarse; Enviada, Aprobada solo permiten previsualización.",
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
    actions: "Acciones",
    action: "Ver",
    actionEditDraft: "Editar",
    actionViewPreview: "Ver",
    actionApprove: "Aprobada",
    actionReject: "Rechazada",
    actionUpdatingStatus: "Actualizando...",
    statusActionsGroup: "Cambiar estado de la cotización",
  },
  statusLabels: {
    draft: "Borrador",
    sent: "Enviada",
    approved: "Aprobada",
    rejected: "Rechazada",
    expired: "Expirado",
  },
  statusUpdate: {
    errorGeneric: "No se pudo actualizar el estado de la cotización.",
  },
};

export default LABELS_QUOTATIONS_LIST_PAGE;

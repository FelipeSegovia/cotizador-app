const LABELS_ROOT_PAGE = {
  title: "Dashboard",
  welcome: "Bienvenido de nuevo.",
  newQuotationButton: "Nueva Cotización",
  metrics: {
    totalQuoted: "Total de cotizaciones (30 días)",
    pendingQuotes: "Cotizaciones Pendientes",
    acceptedQuotes: "Cotizaciones Aceptadas",
  },
  recentQuotations: {
    title: "Cotizaciones Recientes",
    viewAll: "Ver Todo",
    loading: "Cargando cotizaciones...",
    loadError: "No se pudieron cargar las cotizaciones",
    empty: "Aun no tienes cotizaciones creadas.",
    headers: {
      client: "Cliente",
      date: "Fecha",
      amount: "Monto (CLP)",
      status: "Estado",
    },
  },
  conversionCard: {
    title: "Tasa de conversion",
    subtitle: "Basado en cotizaciones aprobadas",
  },
  activity: {
    title: "Actividad Reciente",
  },
  statusLabels: {
    approved: "Aceptada",
    draft: "Borrador",
    rejected: "Rechazada",
    sent: "Enviada",
  },
};

export default LABELS_ROOT_PAGE;

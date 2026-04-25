const LABELS_ROOT_PAGE = {
  title: "Dashboard",
  welcome: "Bienvenido de nuevo, QuoteFlow Chile Operations.",
  newQuotationButton: "Nueva Cotizacion",
  metrics: {
    totalQuoted: "Total Quoted (30 days)",
    pendingQuotes: "Pending Quotes",
    acceptedQuotes: "Accepted Quotes",
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

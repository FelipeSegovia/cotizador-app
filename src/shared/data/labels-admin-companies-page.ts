const LABELS_ADMIN_COMPANIES_PAGE = {
  title: "Empresas",
  subtitle:
    "Crea fichas de empresa y luego invita a un dueño (business) para operarlas.",
  newButton: "Nueva empresa",
  searchPlaceholder: "Buscar empresas...",
  loading: "Cargando empresas...",
  loadError: "No se pudo cargar el listado de empresas.",
  empty: "No hay empresas registradas.",
  table: {
    name: "Razón social",
    rut: "RUT",
    city: "Ciudad",
    contact: "Contacto",
    actions: "Acciones",
    invite: "Invitar dueño",
  },
  createModal: {
    title: "Registrar empresa",
    subtitle: "La empresa se crea sin dueño. Después invita a un usuario business.",
    submit: "Crear empresa",
    submitting: "Creando...",
    cancel: "Cancelar",
    success: "Empresa creada correctamente",
  },
  inviteModal: {
    title: "Invitar dueño de empresa",
    subtitle: "Se enviará una invitación con rol Dueño de empresa",
    success: "Invitación enviada al dueño",
  },
  validation: {
    nameRequired: "La razón social es obligatoria",
    rutRequired: "El RUT es obligatorio",
  },
};

export default LABELS_ADMIN_COMPANIES_PAGE;

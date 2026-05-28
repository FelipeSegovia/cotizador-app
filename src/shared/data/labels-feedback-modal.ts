import type { FeedbackCategory } from "../types/feedback";

const LABELS_FEEDBACK_MODAL = {
  button: "Danos tu opinión",
  title: "Enviar Nuevo Feedback",
  subtitle:
    "Comparte tus sugerencias para mejorar TuSistema. Nuestro equipo revisa cada propuesta.",
  fields: {
    title: "Título",
    titlePlaceholder: "Resumen corto de tu feedback",
    category: "Categoría",
    description: "Descripción",
    descriptionPlaceholder: "Danos más detalles",
  },
  categoryOptions: {
    idea: "Idea",
    feature: "Funcionalidad",
    improvement: "Mejora",
    complaint: "Reclamo",
    opinion: "Opinión",
    bug: "Bug",
    other: "Otro",
  } satisfies Record<FeedbackCategory, string>,
  actions: {
    cancel: "Cancelar",
    submit: "Enviar",
    submitting: "Enviando...",
  },
  validation: {
    titleRequired: "El título es obligatorio",
    titleMinLength: "El título debe tener al menos 3 caracteres",
    categoryRequired: "Selecciona una categoría",
    descriptionRequired: "La descripción es obligatoria",
    descriptionMinLength: "La descripción debe tener al menos 10 caracteres",
  },
  toast: {
    success: "¡Gracias! Tu feedback fue enviada correctamente.",
  },
  errors: {
    submit: "No se pudo enviar tu feedback. Intenta nuevamente.",
  },
};

export default LABELS_FEEDBACK_MODAL;

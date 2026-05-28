import type { FeedbackCategory } from "../types/feedback";

const LABELS_FEEDBACK_MODAL = {
  button: "Sugerir Idea",
  title: "Enviar Nueva Idea",
  subtitle:
    "Comparte tus sugerencias para mejorar QuoteFlow. Nuestro equipo revisa cada propuesta.",
  fields: {
    title: "Título de la idea",
    titlePlaceholder: "Resumen corto de tu idea",
    category: "Categoría",
    description: "Descripción",
    descriptionPlaceholder: "Explica los detalles de tu sugerencia...",
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
    submit: "Enviar Idea",
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
    success: "¡Gracias! Tu idea fue enviada correctamente.",
  },
  errors: {
    submit: "No se pudo enviar tu idea. Intenta nuevamente.",
  },
};

export default LABELS_FEEDBACK_MODAL;

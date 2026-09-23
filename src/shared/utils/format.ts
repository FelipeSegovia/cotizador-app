export const formatCLP = (value: number) =>
  `$${Math.round(value).toLocaleString("es-CL")}`;

export const formatDate = (input: string | Date) => {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (input: string | Date) => {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

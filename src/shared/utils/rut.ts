/** Solo dígitos y K (máx. 9 caracteres alfanuméricos típicos de un RUT chileno). */
export function cleanRutInput(value: string): string {
  return value.replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
}

function formatBodyWithDots(body: string): string {
  if (!body) return "";
  let first = body.length % 3;
  if (first === 0) first = 3;
  const parts: string[] = [body.slice(0, first)];
  for (let i = first; i < body.length; i += 3) {
    parts.push(body.slice(i, i + 3));
  }
  return parts.join(".");
}

/**
 * Formatea el RUT mientras se escribe (puntos y guión antes del dígito verificador).
 * Con menos de 8 caracteres alfanuméricos se asume que aún se ingresa el cuerpo.
 */
export function formatRutAsYouType(value: string): string {
  const cleaned = cleanRutInput(value);
  if (!cleaned) return "";

  let body: string;
  let dv: string;

  if (cleaned.endsWith("K")) {
    body = cleaned.slice(0, -1);
    dv = "K";
  } else if (cleaned.length >= 8) {
    body = cleaned.slice(0, -1);
    dv = cleaned.slice(-1);
  } else {
    body = cleaned;
    dv = "";
  }

  const formattedBody = formatBodyWithDots(body);
  return dv ? `${formattedBody}-${dv}` : formattedBody;
}

/** Valor para API o validación: sin puntos ni guión, solo dígitos y K. */
export function stripRutForApi(value: string): string {
  return value.replace(/[^0-9kK]/gi, "").toUpperCase();
}

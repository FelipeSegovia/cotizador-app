import { fetchErrorMessage } from "../utils";
import { quotationFetch } from "./quotation-fetch";

/** Solicita el PDF al backend (GET). No dispara descarga en el navegador. */
export const downloadQuotationPdf = async (
  quotationId: string,
): Promise<void> => {
  const response = await quotationFetch(`/${quotationId}/pdf`, {
    method: "GET",
  });

  if (!response.ok) {
    const message = await fetchErrorMessage(
      response,
      "No se pudo obtener el PDF de la cotizacion",
    );
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cotizacion-${quotationId}.pdf`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

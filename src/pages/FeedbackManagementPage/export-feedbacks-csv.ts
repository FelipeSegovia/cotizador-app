import { LABELS_FEEDBACK_MANAGEMENT_PAGE } from "../../shared/data";
import type { Feedback } from "../../shared/types/feedback";
import { getAuthorDisplayName } from "./feedback-utils";

const escapeCsvCell = (value: string): string => {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
};

export const exportFeedbacksToCsv = (feedbacks: Feedback[]): void => {
  const headers = LABELS_FEEDBACK_MANAGEMENT_PAGE.csv.headers;
  const rows = [
    [
      headers.id,
      headers.author,
      headers.email,
      headers.title,
      headers.category,
      headers.priority,
      headers.description,
      headers.createdAt,
    ],
    ...feedbacks.map((f) => [
      f.id,
      getAuthorDisplayName(f),
      f.userEmail,
      f.title,
      LABELS_FEEDBACK_MANAGEMENT_PAGE.category[f.category],
      LABELS_FEEDBACK_MANAGEMENT_PAGE.priority[f.priority],
      f.description,
      f.createdAt,
    ]),
  ];

  const csvContent = rows
    .map((row) => row.map((cell) => escapeCsvCell(String(cell))).join(","))
    .join("\n");

  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = LABELS_FEEDBACK_MANAGEMENT_PAGE.csv.filename;
  link.click();
  URL.revokeObjectURL(url);
};

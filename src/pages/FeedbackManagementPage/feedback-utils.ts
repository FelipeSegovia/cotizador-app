import type {
  Feedback,
  FeedbackCategory,
  FeedbackPriority,
} from "../../shared/types/feedback";

export const PAGE_SIZE = 10;

export const getAuthorDisplayName = (feedback: Feedback): string => {
  if (feedback.userName?.trim()) {
    return feedback.userName.trim();
  }
  const localPart = feedback.userEmail.split("@")[0] ?? "";
  return localPart.replace(/[._-]/g, " ").trim() || feedback.userEmail;
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const formatRelativeDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "Hace un momento";
  }
  if (diffMinutes < 60) {
    return `Hace ${diffMinutes} min`;
  }
  if (diffHours < 24) {
    return `Hace ${diffHours} hora${diffHours === 1 ? "" : "s"}`;
  }
  if (diffDays === 1) {
    return `Ayer, ${date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  }

  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const categoryClassMap: Record<FeedbackCategory, string> = {
  bug: "bg-rose-100 text-rose-700",
  feature: "bg-emerald-100 text-emerald-700",
  improvement: "bg-sky-100 text-sky-700",
  idea: "bg-violet-100 text-violet-700",
  complaint: "bg-amber-100 text-amber-800",
  opinion: "bg-slate-200 text-slate-700",
  other: "bg-slate-100 text-slate-600",
};

export const priorityDotClassMap: Record<FeedbackPriority, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-400",
  low: "bg-emerald-500",
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trim()}...`;
};

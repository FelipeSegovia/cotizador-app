export type FeedbackCategory =
  | "idea"
  | "feature"
  | "improvement"
  | "complaint"
  | "opinion"
  | "bug"
  | "other";

export type FeedbackPriority = "high" | "medium" | "low";

export type FeedbackStatus = "new" | "in_review" | "resolved";

export interface Feedback {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  title: string;
  category: FeedbackCategory;
  description: string;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateFeedbackDto = {
  title: string;
  category: FeedbackCategory;
  description: string;
};

export type UpdateFeedbackDto = {
  priority?: FeedbackPriority;
};

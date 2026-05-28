export type FeedbackCategory =
  | "idea"
  | "feature"
  | "improvement"
  | "complaint"
  | "opinion"
  | "bug"
  | "other";

export interface Feedback {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  category: FeedbackCategory;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateFeedbackDto = {
  title: string;
  category: FeedbackCategory;
  description: string;
};

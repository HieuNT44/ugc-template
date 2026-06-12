export type CreatorApplicationStatus = "pending" | "approved" | "rejected";

export type CreatorContentTypes = {
  posts: boolean;
  books: boolean;
  paid: boolean;
};

export type CreatorApplication = {
  userId: string;
  status: CreatorApplicationStatus;
  name: string;
  bio: string;
  country?: string | null;
  website?: string | null;
  topics: string[];
  contentTypes: CreatorContentTypes;
  motivation: string;
  portfolioUrl?: string | null;
  submittedAt: string;
};

import type { OnboardingStep } from "@/core/api/types/enums";
import type {
  ProfileAccomplishment,
  ProfileCertification,
  ProfileEducation,
  ProfileExperience,
} from "@/core/api/types";
import type { UserRole } from "@/core/auth/types";

import type { SettingsTabId } from "../config/profile-permissions";
import type { AppUserSettings } from "./settings";

export type ActionState = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  message?: string;
};

export type ProfileCreatorResources = {
  experiences?: ProfileExperience[];
  educations?: ProfileEducation[];
  certifications?: ProfileCertification[];
  accomplishments?: ProfileAccomplishment[];
};

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  coverUrl?: string | null;
  role: UserRole;
  bio?: string | null;
  /** @deprecated Use location — kept for form backward compatibility */
  country?: string | null;
  website?: string | null;
  createdAt?: string | null;
  username?: string | null;
  headline?: string | null;
  location?: string | null;
  industry?: string | null;
  skills?: string[];
  isPublic?: boolean;
  onboardingStep?: OnboardingStep;
  githubUrl?: string | null;
  facebookUrl?: string | null;
  lineUrl?: string | null;
  linkedinUrl?: string | null;
  xUrl?: string | null;
  youtubeUrl?: string | null;
  settings?: AppUserSettings | null;
  creatorResources?: ProfileCreatorResources;
  /** Community stats (placeholder until UGC module) */
  posts?: number;
  following?: number;
  followers?: number;
  likes?: number;
  committed?: number;
  /** Creator only: expert verification badge */
  verifyExpert?: boolean;
  /** Creator only: expert domains (e.g. AI, React) */
  fields?: string[];
};

export type { SettingsTabId };
export type { AppUserSettings } from "./settings";

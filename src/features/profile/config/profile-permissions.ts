import type { UserRole } from "@/core/auth/types";

export type ProfileRoleGroup = "internal" | "community";

export type ProfileFeature =
  | "editProfile"
  | "viewOwnProfile"
  | "viewPublicProfile"
  | "socialStats"
  | "badges"
  | "changePassword"
  | "viewOwnPosts"
  | "viewPurchasedPosts"
  | "viewSavedPosts"
  | "viewDraftPosts"
  | "manageFeaturedPosts"
  | "appearance"
  | "language"
  | "notifications"
  | "privacy"
  | "deleteAccount"
  | "security"
  /** @deprecated Use viewOwnPosts */
  | "profilePosts";

export type SettingsTabId =
  | "edit"
  | "avatar"
  | "password"
  | "security"
  | "notifications"
  | "privacy"
  | "appearance"
  | "delete";

export type ProfilePostsTabId =
  | "posts"
  | "books"
  | "purchased"
  | "saved"
  | "drafts";

/** Reader: consume content — no own posts, books, or drafts. */
const READER_FEATURES: ProfileFeature[] = [
  "editProfile",
  "viewOwnProfile",
  "viewPublicProfile",
  "socialStats",
  "badges",
  "changePassword",
  "viewPurchasedPosts",
  "viewSavedPosts",
  "appearance",
  "notifications",
  "privacy",
  "deleteAccount",
  "security",
];

const CREATOR_FEATURES: ProfileFeature[] = [
  ...READER_FEATURES,
  "viewOwnPosts",
  "viewDraftPosts",
  "manageFeaturedPosts",
];

const ROLE_FEATURES: Record<UserRole, ProfileFeature[]> = {
  reader: READER_FEATURES,
  creator: CREATOR_FEATURES,
};

const READER_POST_TABS: ProfilePostsTabId[] = ["purchased", "saved"];
const CREATOR_POST_TABS: ProfilePostsTabId[] = [
  "posts",
  "books",
  "purchased",
  "saved",
  "drafts",
];

export const PROFILE_POSTS_TAB_LABELS: Record<ProfilePostsTabId, string> = {
  posts: "Your posts",
  books: "Your books",
  purchased: "Purchased",
  saved: "Saved",
  drafts: "Drafts",
};

export function getProfileRoleGroup(_role: UserRole): ProfileRoleGroup {
  return "community";
}

export function hasProfileFeature(
  role: UserRole,
  feature: ProfileFeature
): boolean {
  if (feature === "profilePosts") {
    return hasProfileFeature(role, "viewOwnPosts");
  }
  return ROLE_FEATURES[role]?.includes(feature) ?? false;
}

export function getSettingsTabsForRole(_role: UserRole): SettingsTabId[] {
  return [
    "edit",
    "avatar",
    "password",
    "security",
    "notifications",
    "privacy",
    "appearance",
    "delete",
  ];
}

export function getProfilePostsTabsForRole(
  role: UserRole
): ProfilePostsTabId[] {
  if (role === "creator") {
    return CREATOR_POST_TABS;
  }
  if (role === "reader") {
    return READER_POST_TABS;
  }
  return [];
}

export function getDefaultProfilePostsTab(
  role: UserRole
): ProfilePostsTabId | null {
  const tabs = getProfilePostsTabsForRole(role);
  return tabs[0] ?? null;
}

export function canAccessProfilePostsTabs(role: UserRole): boolean {
  return getProfilePostsTabsForRole(role).length > 0;
}

export function isInternalProfileRole(role: UserRole): boolean {
  return getProfileRoleGroup(role) === "internal";
}

/** Whether a profile posts tab is allowed for the given role. */
export function isProfilePostsTabAllowed(
  role: UserRole,
  tabId: ProfilePostsTabId
): boolean {
  return getProfilePostsTabsForRole(role).includes(tabId);
}

import { apiRequest } from "@/core/api/server";
import type { UserPost } from "@/core/types";
import type { UserBook } from "@/core/types/user-book";
import type { ApiFeedItem } from "@/features/reading/lib/feed-api";

import {
  mapApiFeedItemsToUserBooks,
  mapApiFeedItemsToUserPosts,
  mapApiPublicProfile,
  type ApiPublicProfile,
} from "./public-profile-api";
import type { PublicProfile } from "../types/public-profile";

export async function getPublicProfileByUsername(
  username: string
): Promise<PublicProfile | null> {
  const result = await apiRequest<ApiPublicProfile>({
    path: `/profiles/${encodeURIComponent(username)}`,
    method: "GET",
  });

  if (!result.ok) {
    return null;
  }

  return mapApiPublicProfile(result.data);
}

export async function getPublicPostsByUsername(
  username: string
): Promise<UserPost[]> {
  const result = await apiRequest<ApiFeedItem[]>({
    path: `/profiles/${encodeURIComponent(username)}/contents`,
    method: "GET",
    searchParams: {
      type: "blog",
      sort: "-published_at",
      per_page: 50,
    },
  });

  if (!result.ok) {
    return [];
  }

  return mapApiFeedItemsToUserPosts(result.data);
}

export async function getPublicRepostsByUsername(
  _username: string
): Promise<UserPost[]> {
  return [];
}

export async function getPublicBooksByUsername(
  username: string
): Promise<UserBook[]> {
  const result = await apiRequest<ApiFeedItem[]>({
    path: `/profiles/${encodeURIComponent(username)}/contents`,
    method: "GET",
    searchParams: {
      type: "book",
      sort: "-published_at",
      per_page: 50,
    },
  });

  if (!result.ok) {
    return [];
  }

  return mapApiFeedItemsToUserBooks(result.data);
}

export async function getPublicFeaturedPostsByUsername(
  username: string
): Promise<UserPost[]> {
  const posts = await getPublicPostsByUsername(username);

  return posts.slice(0, 2);
}

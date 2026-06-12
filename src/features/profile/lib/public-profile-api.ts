import type { UserPost } from "@/core/types";
import type { UserBook } from "@/core/types/user-book";

import {
  mapApiFeedItemToFeedPost,
  type ApiFeedItem,
} from "@/features/reading/lib/feed-api";

import type { PublicProfile } from "../types/public-profile";

export type ApiPublicProfile = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "reader" | "creator" | "admin";
  bio: string | null;
  website_url: string | null;
  posts_count: number;
  books_count: number;
  following_count: number;
  followers_count: number;
  github_url: string | null;
  facebook_url: string | null;
  line_url: string | null;
  is_certified: boolean;
  skills: string[] | null;
};

export function mapApiPublicProfile(data: ApiPublicProfile): PublicProfile {
  const role = data.role === "admin" ? "creator" : data.role;

  return {
    id: data.id,
    username: data.username,
    name: data.full_name,
    image: data.avatar_url,
    role,
    bio: data.bio,
    website: data.website_url,
    posts: data.posts_count,
    books: data.books_count,
    following: data.following_count,
    followers: data.followers_count,
    githubUrl: data.github_url,
    facebookUrl: data.facebook_url,
    lineUrl: data.line_url,
    verifyExpert: data.is_certified,
    fields: data.skills ?? [],
  };
}

export function mapApiFeedItemsToUserPosts(items: ApiFeedItem[]): UserPost[] {
  return items.map((item) => {
    const feedPost = mapApiFeedItemToFeedPost(item);

    return {
      ...feedPost,
      authorSubtitle: null,
    };
  });
}

export function mapApiFeedItemsToUserBooks(items: ApiFeedItem[]): UserBook[] {
  return items.map((item) => {
    const feedPost = mapApiFeedItemToFeedPost(item);

    return {
      id: feedPost.id,
      title: feedPost.title,
      description: feedPost.snippet,
      coverImageUrl: feedPost.coverImageUrl,
      author: feedPost.author,
      publishedAt: feedPost.publishedAt,
      chapterCount: 0,
      labels: feedPost.labels,
      href: feedPost.href,
    };
  });
}

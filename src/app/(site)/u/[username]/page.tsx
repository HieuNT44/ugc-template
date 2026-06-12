import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/core/auth";
import {
  getPublicBooksByUsername,
  getPublicFeaturedPostsByUsername,
  getPublicPostsByUsername,
  getPublicProfileByUsername,
  getProfileFromSession,
  getProfileUsername,
  PublicProfileOverview,
} from "@/features/profile";

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { username: rawUsername } = await params;
  const username = decodeURIComponent(rawUsername);

  const [profile, posts, books, featuredPosts] = await Promise.all([
    getPublicProfileByUsername(username),
    getPublicPostsByUsername(username),
    getPublicBooksByUsername(username),
    getPublicFeaturedPostsByUsername(username),
  ]);

  if (!profile) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  if (session?.user) {
    const ownProfile = await getProfileFromSession(session);
    if (ownProfile) {
      const ownUsername = getProfileUsername(ownProfile);
      if (ownUsername.toLowerCase() === username.toLowerCase()) {
        redirect("/profile");
      }
    }
  }

  return (
    <div className='PublicProfilePage mx-auto w-full max-w-6xl flex-1 px-6 py-6 lg:py-8'>
      <PublicProfileOverview
        profile={profile}
        posts={posts}
        books={books}
        featuredPosts={featuredPosts}
      />
    </div>
  );
}

export async function generateMetadata({ params }: PublicProfilePageProps) {
  const { username: rawUsername } = await params;
  const username = decodeURIComponent(rawUsername);
  const profile = await getPublicProfileByUsername(username);

  if (!profile) {
    return { title: "Profile not found" };
  }

  const displayName = profile.name ?? profile.username;

  return {
    title: `${displayName} (@${profile.username}) | RealRead`,
    description:
      profile.bio ?? `Public profile of @${profile.username} on RealRead.`,
  };
}

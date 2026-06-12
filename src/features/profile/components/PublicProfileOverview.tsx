"use client";

import { Globe } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VerifiedExpertBadge } from "@/core/components/badges";
import { getAvatarInitials } from "@/core/lib/avatar-initials";

import type { UserPost } from "@/core/types";
import type { UserBook } from "@/core/types/user-book";

import type { PublicProfile } from "../types/public-profile";
import { ProfileSocialSummary } from "./ProfileSocialSummary";
import { ProfileCvSections } from "./ProfileCvSections";
import { PublicProfilePostsTabs } from "./PublicProfilePostsTabs";

interface PublicProfileOverviewProps {
  profile: PublicProfile;
  posts?: UserPost[];
  books?: UserBook[];
  featuredPosts?: UserPost[];
}

function showVerifiedExpert(profile: PublicProfile): boolean {
  return profile.role === "creator" && Boolean(profile.verifyExpert);
}

export function PublicProfileOverview({
  profile,
  posts = [],
  books = [],
  featuredPosts = [],
}: PublicProfileOverviewProps) {
  const initials = getAvatarInitials(profile.name ?? profile.username);
  const bioText = profile.bio?.trim() ? profile.bio : "No bio yet";

  return (
    <div className='PublicProfileOverview'>
      <div className='flex flex-col gap-6 md:flex-row md:items-start'>
        <Card className='flex w-full shrink-0 flex-col gap-4 p-6 md:w-[380px] md:max-w-[380px] lg:w-[400px] lg:max-w-[400px]'>
          <div className='text-center'>
            <Avatar className='border-primary mx-auto mb-4 size-48 overflow-hidden rounded-full border-2 after:hidden'>
              {profile.image ? (
                <AvatarImage
                  src={profile.image}
                  alt={profile.name ?? profile.username}
                  className='object-cover object-center'
                />
              ) : null}
              <AvatarFallback className='text-2xl'>{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className='flex items-center justify-center gap-1.5'>
              <span>@{profile.username}</span>
              {showVerifiedExpert(profile) ? (
                <VerifiedExpertBadge fields={profile.fields ?? []} />
              ) : null}
            </CardTitle>
            {profile.name && profile.name !== profile.username ? (
              <CardDescription>{profile.name}</CardDescription>
            ) : null}
            <ProfileSocialSummary
              posts={profile.posts}
              following={profile.following}
              followers={profile.followers}
              githubUrl={profile.githubUrl}
              facebookUrl={profile.facebookUrl}
              lineUrl={profile.lineUrl}
            />
          </div>

          <Separator />

          <p className='text-muted-foreground text-left text-sm leading-relaxed whitespace-pre-wrap'>
            {bioText}
          </p>

          {profile.website?.trim() ? (
            <>
              <Separator />
              <a
                href={profile.website}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary inline-flex items-center gap-2 text-sm underline underline-offset-4'
              >
                <Globe className='size-4 shrink-0' />
                {profile.website.replace(/^https?:\/\//, "")}
              </a>
            </>
          ) : null}

          <Separator />
          <ProfileCvSections
            role={profile.role}
            username={profile.username}
            variant='sidebar'
          />
        </Card>

        <div className='flex min-w-0 flex-1 flex-col gap-6'>
          <PublicProfilePostsTabs
            profile={profile}
            posts={posts}
            books={books}
            featuredPosts={featuredPosts}
          />
        </div>
      </div>
    </div>
  );
}

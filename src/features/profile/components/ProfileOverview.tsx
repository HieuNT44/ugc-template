"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  isProfileCvEmpty,
  mapCreatorResourcesToProfileCv,
} from "@/core/api/mappers/profile-cv.mapper";

import { Briefcase, Building2, Globe, Mail, MapPin } from "lucide-react";

import { isInternalProfileRole } from "../config/profile-permissions";

import type { Profile } from "../types";
import { VerifiedExpertBadge } from "@/core/components/badges";

import { canAccessProfilePostsTabs } from "../config/profile-permissions";
import { getUsernameInitials } from "../lib/profile-avatar";
import { getProfileUsername } from "../lib/profile-username";

import { ProfilePostsTabs } from "./ProfilePostsTabs";
import { ProfileCvSections } from "./ProfileCvSections";
import { ProfileSocialSummary } from "./ProfileSocialSummary";

interface ProfileOverviewProps {
  profile: Profile;
}

function showVerifiedExpert(profile: Profile): boolean {
  return profile.role === "creator" && Boolean(profile.verifyExpert);
}

export function ProfileOverview({ profile }: ProfileOverviewProps) {
  const isInternal = isInternalProfileRole(profile.role);
  const isCommunity = !isInternal;
  const showPostsTabs = canAccessProfilePostsTabs(profile.role);
  const handle = profile.username?.trim() || getProfileUsername(profile);
  const displayName = profile.name?.trim() || "—";
  const avatarSrc = profile.image?.trim() || undefined;
  const initials = getUsernameInitials(handle);
  const bioText = profile.bio?.trim() ? profile.bio : "No bio yet";
  const isCreator = profile.role === "creator";

  const profileCv =
    isCreator && profile.creatorResources
      ? mapCreatorResourcesToProfileCv({
          skills: profile.skills,
          experiences: profile.creatorResources.experiences,
          educations: profile.creatorResources.educations,
          certifications: profile.creatorResources.certifications,
          accomplishments: profile.creatorResources.accomplishments,
        })
      : null;

  const showCvSections =
    isCreator && profileCv !== null && !isProfileCvEmpty(profileCv);

  return (
    <div className='ProfileOverview'>
      <div className='flex flex-col gap-6 md:flex-row md:items-start'>
        <Card className='flex w-full shrink-0 flex-col gap-4 p-6 md:w-[380px] md:max-w-[380px] lg:w-[400px] lg:max-w-[400px]'>
          <div className='text-center'>
            <Avatar className='border-primary mx-auto mb-4 size-48 overflow-hidden rounded-full border-2 after:hidden'>
              {avatarSrc ? (
                <AvatarImage
                  src={avatarSrc}
                  alt={displayName}
                  className='object-cover object-center'
                />
              ) : null}
              <AvatarFallback className='bg-muted text-foreground text-2xl font-medium'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <CardTitle className='flex items-center justify-center gap-1.5'>
              <span>{displayName}</span>
              {showVerifiedExpert(profile) ? (
                <VerifiedExpertBadge fields={profile.fields ?? []} />
              ) : null}
            </CardTitle>
            <CardDescription>@{handle}</CardDescription>
            {isCommunity ? (
              <ProfileSocialSummary
                posts={0}
                following={0}
                followers={0}
                websiteUrl={profile.website}
                githubUrl={profile.githubUrl}
                facebookUrl={profile.facebookUrl}
                lineUrl={profile.lineUrl}
                settingsProfileHref='/settings/profile'
              />
            ) : null}
          </div>

          <Separator />

          {isCommunity ? (
            <p className='text-muted-foreground text-left text-sm leading-relaxed whitespace-pre-wrap'>
              {bioText}
            </p>
          ) : (
            <CardContent className='space-y-3 p-0'>
              <div className='flex items-center gap-3'>
                <Briefcase className='text-muted-foreground size-4 shrink-0' />
                <span className='text-sm capitalize'>{profile.role}</span>
              </div>
            </CardContent>
          )}

          <Separator />

          <CardContent className='space-y-4 p-0'>
            <InfoRow icon={Mail} label='Email' value={profile.email} />
            <InfoRow
              icon={MapPin}
              label='Location'
              value={profile.location ?? profile.country}
            />
            <InfoRow
              icon={Globe}
              label='Website'
              value={profile.website}
              isLink
            />
            {isCommunity ? (
              <InfoRow
                icon={Building2}
                label='Industry'
                value={profile.industry}
              />
            ) : null}
            {isInternal ? (
              <InfoRow icon={Briefcase} label='Role' value={profile.role} />
            ) : null}
          </CardContent>

          {showCvSections ? (
            <>
              <Separator />
              <ProfileCvSections
                cv={profileCv}
                variant='sidebar'
                useMockFallback={false}
              />
            </>
          ) : null}

          <Button
            variant='default'
            className='mt-2 w-full rounded-full'
            asChild
          >
            <Link href='/settings/profile'>Edit profile</Link>
          </Button>
        </Card>

        <div className='flex min-w-0 flex-1 flex-col gap-6'>
          {showPostsTabs ? (
            <ProfilePostsTabs role={profile.role} username={handle} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  isLink = false,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
  isLink?: boolean;
}) {
  return (
    <div className='flex items-start gap-3'>
      <div className='bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg'>
        <Icon className='text-muted-foreground size-4' />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-medium'>{label}</p>
        {isLink && value ? (
          <a
            href={value}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary text-sm break-all underline underline-offset-4'
          >
            {value}
          </a>
        ) : (
          <p className='text-muted-foreground text-sm break-all'>
            {value ?? "—"}
          </p>
        )}
      </div>
    </div>
  );
}

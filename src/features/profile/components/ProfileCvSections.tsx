"use client";

import {
  Award,
  BadgeCheck,
  Briefcase,
  GraduationCap,
  Medal,
  Sparkles,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/core/auth/types";

import { getMockProfileCv, isCommunityCvRole } from "../lib/mock-profile-cv";
import type {
  ProfileAccomplishmentItem,
  ProfileCertificationGroup,
  ProfileCv,
  ProfileEducation,
  ProfileSkill,
  ProfileWorkExperience,
} from "../types/profile-cv";

interface ProfileCvSectionsProps {
  role?: UserRole;
  cv?: ProfileCv | null;
  username?: string;
  /** When false, only render provided cv data (no mock fallback). */
  useMockFallback?: boolean;
  /** Embedded inside the profile sidebar card */
  variant?: "sidebar" | "standalone";
}

export function ProfileCvSections({
  role = "reader",
  cv,
  username,
  useMockFallback = true,
  variant = "standalone",
}: ProfileCvSectionsProps) {
  if (!isCommunityCvRole(role) && useMockFallback) {
    return null;
  }

  const resolvedCv = useMockFallback
    ? (cv ?? getMockProfileCv(role, username))
    : cv;

  if (!resolvedCv) {
    return null;
  }

  const isSidebar = variant === "sidebar";
  const sections = (
    <div className='divide-border flex flex-col divide-y'>
      {resolvedCv.skills.length > 0 ? (
        <ProfileSkillsSection skills={resolvedCv.skills} compact={isSidebar} />
      ) : null}
      {resolvedCv.workExperiences.length > 0 ? (
        <ProfileWorkExperienceSection
          experiences={resolvedCv.workExperiences}
          compact={isSidebar}
        />
      ) : null}
      {resolvedCv.education.length > 0 ? (
        <ProfileEducationSection
          education={resolvedCv.education}
          compact={isSidebar}
        />
      ) : null}
      {resolvedCv.certificationGroups.length > 0 ? (
        <ProfileCertificationsSection
          groups={resolvedCv.certificationGroups}
          compact={isSidebar}
        />
      ) : null}
      {resolvedCv.accomplishments.length > 0 ? (
        <ProfileAccomplishmentsSection
          accomplishments={resolvedCv.accomplishments}
          compact={isSidebar}
        />
      ) : null}
    </div>
  );

  const hasVisibleSection =
    resolvedCv.skills.length > 0 ||
    resolvedCv.workExperiences.length > 0 ||
    resolvedCv.education.length > 0 ||
    resolvedCv.certificationGroups.length > 0 ||
    resolvedCv.accomplishments.length > 0;

  if (!hasVisibleSection) {
    return null;
  }

  if (isSidebar) {
    return <div className='ProfileCvSections'>{sections}</div>;
  }

  return (
    <Card className='ProfileCvSections gap-0 overflow-hidden py-0'>
      {sections}
    </Card>
  );
}

function SectionShell({
  title,
  icon: Icon,
  children,
  className,
  compact = false,
}: {
  title: string;
  icon: typeof Sparkles;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(compact ? "py-4" : "px-4 py-5 sm:px-6 sm:py-6", className)}
    >
      <div className='mb-3 flex items-center gap-2'>
        <Icon className='text-muted-foreground size-4 shrink-0' aria-hidden />
        <h2 className='text-sm font-semibold tracking-tight sm:text-base'>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function StatusBadge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "default"
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground"
      )}
    >
      {children}
    </span>
  );
}

function ProfileSkillsSection({
  skills,
  compact = false,
}: {
  skills: ProfileSkill[];
  compact?: boolean;
}) {
  return (
    <SectionShell title='Skills' icon={Sparkles} compact={compact}>
      <ul className='text-muted-foreground space-y-1.5 text-sm leading-relaxed'>
        {skills.map((skill) => (
          <li key={skill.id} className='flex gap-2'>
            <span className='text-foreground shrink-0' aria-hidden>
              +
            </span>
            <span>
              {skill.name}
              {skill.yearsLabel ? (
                <span className='text-muted-foreground'>
                  {" "}
                  ({skill.yearsLabel})
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function ProfileWorkExperienceSection({
  experiences,
  compact = false,
}: {
  experiences: ProfileWorkExperience[];
  compact?: boolean;
}) {
  return (
    <SectionShell title='Work Experiences' icon={Briefcase} compact={compact}>
      <ul className='flex flex-col gap-4'>
        {experiences.map((experience) => (
          <li
            key={experience.id}
            className='border-border relative border-l-2 pl-3.5'
          >
            <div className='bg-card ring-foreground/20 absolute top-1.5 -left-[5px] size-2 rounded-full ring-2' />
            <div className='flex flex-col gap-1.5'>
              <div className='flex flex-col gap-1'>
                <div className='flex flex-wrap items-center gap-1.5'>
                  <h3 className='text-sm font-semibold'>
                    {experience.company}
                  </h3>
                  {experience.isCurrent ? (
                    <StatusBadge>Current</StatusBadge>
                  ) : null}
                  {experience.isVerified ? (
                    <span className='text-primary inline-flex items-center gap-1 text-xs font-medium'>
                      <BadgeCheck className='size-3.5' aria-hidden />
                      Verified
                    </span>
                  ) : null}
                </div>
                <p className='text-muted-foreground text-xs'>
                  {experience.durationLabel}
                  {experience.location ? ` · ${experience.location}` : ""}
                  {compact ? ` · ${experience.startLabel}` : ""}
                </p>
              </div>

              {!compact ? (
                <p className='text-muted-foreground text-xs sm:text-sm'>
                  {experience.startLabel}
                </p>
              ) : null}

              <p className='text-sm font-medium'>{experience.title}</p>

              {experience.description ? (
                <p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
                  {experience.description}
                </p>
              ) : null}

              {experience.highlights && experience.highlights.length > 0 ? (
                <ul className='text-muted-foreground list-disc space-y-1 pl-4 text-xs leading-relaxed sm:text-sm'>
                  {experience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function ProfileEducationSection({
  education,
  compact = false,
}: {
  education: ProfileEducation[];
  compact?: boolean;
}) {
  return (
    <SectionShell title='Education' icon={GraduationCap} compact={compact}>
      <ul className='flex flex-col gap-3'>
        {education.map((item) => (
          <li key={item.id} className='space-y-1'>
            <h3 className='text-sm font-semibold'>{item.institution}</h3>
            <p className='text-muted-foreground text-sm'>{item.degree}</p>
            <p className='text-muted-foreground text-xs'>
              {item.endLabel} – {item.startLabel}
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function ProfileCertificationsSection({
  groups,
  compact = false,
}: {
  groups: ProfileCertificationGroup[];
  compact?: boolean;
}) {
  return (
    <SectionShell title='Certifications' icon={Medal} compact={compact}>
      <ul className='flex flex-col gap-4'>
        {groups.map((group) => (
          <li key={group.id} className='flex flex-col gap-2'>
            <div className='flex flex-wrap items-center gap-1.5'>
              <h3 className='text-sm font-semibold'>{group.issuer}</h3>
              {group.isCurrent ? <StatusBadge>Current</StatusBadge> : null}
              {group.durationLabel ? (
                <span className='text-muted-foreground text-xs'>
                  {group.durationLabel}
                </span>
              ) : null}
            </div>
            <ul className='flex flex-col gap-1.5'>
              {group.certifications.map((cert) => (
                <li
                  key={cert.id}
                  className='bg-muted/70 ring-border/70 flex flex-col gap-0.5 rounded-lg px-3 py-2 ring-1'
                >
                  <span className='text-sm leading-snug'>{cert.name}</span>
                  <span className='text-muted-foreground text-xs'>
                    {cert.issuedLabel}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function ProfileAccomplishmentsSection({
  accomplishments,
  compact = false,
}: {
  accomplishments: ProfileAccomplishmentItem[];
  compact?: boolean;
}) {
  return (
    <SectionShell title='Accomplishments' icon={Award} compact={compact}>
      <ul className='flex flex-col gap-3'>
        {accomplishments.map((item) => (
          <li key={item.id} className='space-y-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h3 className='text-sm font-semibold'>{item.title}</h3>
              <StatusBadge variant='muted'>{item.type}</StatusBadge>
            </div>
            {item.description ? (
              <p className='text-muted-foreground text-xs leading-relaxed sm:text-sm'>
                {item.description}
              </p>
            ) : null}
            <p className='text-muted-foreground text-xs'>{item.dateLabel}</p>
            {item.url ? (
              <a
                href={item.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary text-xs underline underline-offset-4'
              >
                View link
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

import type { UserRole } from "@/core/auth/types";

import type { ProfileCv } from "../types/profile-cv";

const CREATOR_CV: ProfileCv = {
  skills: [
    { id: "s1", name: "ReactJS", yearsLabel: "4 years +" },
    { id: "s2", name: "NextJS", yearsLabel: "4 years +" },
    { id: "s3", name: "TypeScript", yearsLabel: "7 years +" },
    { id: "s4", name: "Node.js", yearsLabel: "6 years +" },
    { id: "s5", name: "PostgreSQL", yearsLabel: "9 years +" },
    { id: "s6", name: "AWS", yearsLabel: "9 years +" },
    { id: "s7", name: "NestJS", yearsLabel: "6 years +" },
    { id: "s8", name: "Technical Writing", yearsLabel: "5 years +" },
    { id: "s9", name: "Firebase", yearsLabel: "4 years +" },
    { id: "s10", name: "GraphQL", yearsLabel: "5 years +" },
  ],
  workExperiences: [
    {
      id: "w1",
      company: "RealRead",
      title: "Principal Content Engineer",
      isCurrent: true,
      isVerified: true,
      durationLabel: "2 years 3 months",
      location: "Remote",
      startLabel: "Jan 2024",
      description:
        "Lead creator platform features and long-form publishing workflows for a global reading community.",
      highlights: [
        "Shipped creator studio, paid posts, and expert verification badges.",
        "Architected profile and UGC modules with Next.js App Router.",
      ],
    },
    {
      id: "w2",
      company: "TOMOSIA",
      title: "Senior Frontend Engineer",
      isVerified: true,
      durationLabel: "4 years 1 month",
      location: "Hybrid · Tokyo",
      startLabel: "Dec 2019",
      description:
        "Built design systems and customer-facing dashboards for enterprise SaaS products.",
      highlights: [
        "Migrated legacy apps to React + TypeScript with shared component libraries.",
        "Mentored junior engineers on accessibility and performance best practices.",
      ],
    },
    {
      id: "w3",
      company: "Freelance",
      title: "Technical Writer & Developer",
      durationLabel: "3 years",
      location: "Remote",
      startLabel: "Sep 2016",
      description:
        "Published tutorials and documentation for startups adopting modern JavaScript stacks.",
    },
  ],
  education: [
    {
      id: "e1",
      institution: "Tokyo Institute of Technology",
      degree: "Computer Science · B.Sc.",
      startLabel: "Apr 2012",
      endLabel: "Mar 2016",
    },
    {
      id: "e2",
      institution: "Coursera · Creative Writing Specialization",
      degree: "Professional Certificate",
      startLabel: "Jan 2021",
      endLabel: "Aug 2021",
    },
  ],
  certificationGroups: [
    {
      id: "c1",
      issuer: "AWS",
      isCurrent: true,
      durationLabel: "3 years",
      certifications: [
        {
          id: "c1-1",
          name: "Solutions Architect Associate",
          issuedLabel: "Mar 2024",
        },
        { id: "c1-2", name: "Developer Associate", issuedLabel: "Nov 2022" },
      ],
    },
    {
      id: "c2",
      issuer: "HashiCorp",
      isCurrent: true,
      certifications: [
        {
          id: "c2-1",
          name: "Terraform Associate (003)",
          issuedLabel: "Mar 2026",
        },
      ],
    },
    {
      id: "c3",
      issuer: "RealRead Creator Program",
      isCurrent: true,
      certifications: [
        {
          id: "c3-1",
          name: "Verified Expert · Architecture",
          issuedLabel: "May 2025",
        },
        { id: "c3-2", name: "Long-form Publishing", issuedLabel: "Feb 2025" },
      ],
    },
  ],
  accomplishments: [],
};

const READER_CV: ProfileCv = {
  skills: [
    { id: "r1", name: "Literary Fiction", yearsLabel: "6 years +" },
    { id: "r2", name: "Essays & Non-fiction", yearsLabel: "5 years +" },
    { id: "r3", name: "Japanese", yearsLabel: "9 years +" },
    { id: "r4", name: "English", yearsLabel: "14 years +" },
    { id: "r5", name: "Book Notes", yearsLabel: "4 years +" },
    { id: "r6", name: "Critical Reading", yearsLabel: "3 years +" },
    { id: "r7", name: "Poetry", yearsLabel: "2 years +" },
  ],
  workExperiences: [
    {
      id: "rw1",
      company: "Community Library Volunteer",
      title: "Reading Program Coordinator",
      isCurrent: true,
      durationLabel: "1 year 6 months",
      location: "Part-time · Local",
      startLabel: "Sep 2024",
      description:
        "Organize monthly reading circles and curate recommended lists for new members.",
      highlights: [
        "Facilitated discussions for 40+ participants across fiction and essay genres.",
      ],
    },
    {
      id: "rw2",
      company: "University Literature Club",
      title: "Editor · Newsletter",
      durationLabel: "2 years",
      location: "On campus",
      startLabel: "Apr 2020",
      description:
        "Edited member essays and published a weekly digest of essays and short reviews.",
    },
  ],
  education: [
    {
      id: "re1",
      institution: "Waseda University",
      degree: "Comparative Literature · B.A.",
      startLabel: "Apr 2018",
      endLabel: "Mar 2022",
    },
  ],
  certificationGroups: [
    {
      id: "rc1",
      issuer: "JLPT",
      isCurrent: true,
      certifications: [
        {
          id: "rc1-1",
          name: "Japanese Language Proficiency · N2",
          issuedLabel: "Dec 2023",
        },
      ],
    },
    {
      id: "rc2",
      issuer: "RealRead Reader Program",
      isCurrent: true,
      certifications: [
        { id: "rc2-1", name: "Active Reader Badge", issuedLabel: "Jan 2025" },
        { id: "rc2-2", name: "Essay Curator", issuedLabel: "Jun 2025" },
      ],
    },
  ],
  accomplishments: [],
};

export function getMockProfileCv(
  role: UserRole,
  _username?: string
): ProfileCv | null {
  if (role === "creator") {
    return CREATOR_CV;
  }
  if (role === "reader") {
    return READER_CV;
  }
  return null;
}

export function isCommunityCvRole(
  role: UserRole
): role is Extract<UserRole, "reader" | "creator"> {
  return role === "reader" || role === "creator";
}

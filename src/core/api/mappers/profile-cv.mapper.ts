import type {
  ProfileAccomplishment,
  ProfileCertification,
  ProfileEducation,
  ProfileExperience,
} from "@/core/api/types";
import type {
  ProfileAccomplishmentItem,
  ProfileCertificationGroup,
  ProfileCv,
  ProfileEducation as UiProfileEducation,
  ProfileSkill,
  ProfileWorkExperience,
} from "@/features/profile/types/profile-cv";

function formatYearMonth(date: string | null | undefined): string {
  if (!date) {
    return "";
  }
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatDuration(
  start: string | null | undefined,
  end: string | null | undefined,
  isCurrent?: boolean
): string {
  const startLabel = formatYearMonth(start);
  const endLabel = isCurrent ? "現在" : formatYearMonth(end);
  if (!startLabel && !endLabel) {
    return "";
  }
  if (!endLabel) {
    return startLabel;
  }
  return `${startLabel} – ${endLabel}`;
}

function mapSkills(skills: string[]): ProfileSkill[] {
  return skills.map((name, index) => ({
    id: `skill-${index}`,
    name,
    yearsLabel: "",
  }));
}

function mapExperiences(
  experiences: ProfileExperience[] | undefined
): ProfileWorkExperience[] {
  return (experiences ?? []).map((item) => ({
    id: String(item.id),
    company: item.company_name,
    title: item.title,
    isCurrent: item.is_current,
    durationLabel: formatDuration(
      item.start_date,
      item.end_date,
      item.is_current
    ),
    location: item.location ?? undefined,
    startLabel: formatYearMonth(item.start_date),
    description: item.description ?? undefined,
  }));
}

function mapEducations(
  educations: ProfileEducation[] | undefined
): UiProfileEducation[] {
  return (educations ?? []).map((item) => ({
    id: String(item.id),
    institution: item.school_name,
    degree: [item.degree, item.field_of_study].filter(Boolean).join(" · "),
    startLabel: formatYearMonth(item.start_date),
    endLabel: formatYearMonth(item.end_date) || "現在",
  }));
}

function mapCertifications(
  certifications: ProfileCertification[] | undefined
): ProfileCertificationGroup[] {
  const groups = new Map<string, ProfileCertificationGroup>();

  for (const item of certifications ?? []) {
    const issuer = item.issuing_organization;
    const group = groups.get(issuer) ?? {
      id: issuer,
      issuer,
      certifications: [],
    };

    group.certifications.push({
      id: String(item.id),
      name: item.name,
      issuedLabel: formatYearMonth(item.issue_date) || "—",
    });

    groups.set(issuer, group);
  }

  return [...groups.values()];
}

function mapAccomplishments(
  accomplishments: ProfileAccomplishment[] | undefined
): ProfileAccomplishmentItem[] {
  return (accomplishments ?? []).map((item) => ({
    id: String(item.id),
    type: item.type,
    title: item.title,
    description: item.description ?? undefined,
    dateLabel: formatYearMonth(item.date) || "—",
    url: item.url ?? undefined,
  }));
}

export function mapCreatorResourcesToProfileCv(input: {
  skills?: string[];
  experiences?: ProfileExperience[];
  educations?: ProfileEducation[];
  certifications?: ProfileCertification[];
  accomplishments?: ProfileAccomplishment[];
}): ProfileCv {
  return {
    skills: mapSkills(input.skills ?? []),
    workExperiences: mapExperiences(input.experiences),
    education: mapEducations(input.educations),
    certificationGroups: mapCertifications(input.certifications),
    accomplishments: mapAccomplishments(input.accomplishments),
  };
}

export function isProfileCvEmpty(cv: ProfileCv): boolean {
  return (
    cv.skills.length === 0 &&
    cv.workExperiences.length === 0 &&
    cv.education.length === 0 &&
    cv.certificationGroups.length === 0 &&
    cv.accomplishments.length === 0
  );
}

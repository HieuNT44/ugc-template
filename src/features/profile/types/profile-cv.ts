export type ProfileSkill = {
  id: string;
  name: string;
  /** e.g. "4 years +" */
  yearsLabel: string;
};

export type ProfileWorkExperience = {
  id: string;
  company: string;
  title: string;
  isCurrent?: boolean;
  isVerified?: boolean;
  durationLabel: string;
  location?: string;
  startLabel: string;
  description?: string;
  highlights?: string[];
};

export type ProfileEducation = {
  id: string;
  institution: string;
  degree: string;
  startLabel: string;
  endLabel: string;
};

export type ProfileCertification = {
  id: string;
  name: string;
  issuedLabel: string;
};

export type ProfileCertificationGroup = {
  id: string;
  issuer: string;
  isCurrent?: boolean;
  durationLabel?: string;
  certifications: ProfileCertification[];
};

export type ProfileAccomplishmentItem = {
  id: string;
  type: string;
  title: string;
  description?: string;
  dateLabel: string;
  url?: string;
};

export type ProfileCv = {
  skills: ProfileSkill[];
  workExperiences: ProfileWorkExperience[];
  education: ProfileEducation[];
  certificationGroups: ProfileCertificationGroup[];
  accomplishments: ProfileAccomplishmentItem[];
};

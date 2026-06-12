import type { AccomplishmentType, AppLanguage } from "@/core/api/types/enums";

const LABELS = {
  en: {
    save: "保存",
    saving: "保存中...",
    addItem: "項目を追加",
    removeItem: "削除",
    emptyTitle: "項目はまだありません",
    emptyDescription: "最初の項目を追加してプロフィールに表示しましょう。",
    genericError: "問題が発生しました。もう一度お試しください。",
    unauthorized: "続行するにはログインしてください。",
    saved: "変更を保存しました",
    experiences: {
      title: "職歴",
      description:
        "役職、会社、期間を追加します。公開プロフィールに表示されます。",
      company: "会社",
      titleField: "役職",
      location: "所在地",
      startDate: "開始日",
      endDate: "終了日",
      isCurrent: "現在ここで働いています",
      descriptionField: "説明",
      companyPh: "例：Acme株式会社",
      titlePh: "例：シニアエンジニア",
      locationPh: "例：東京、日本",
      descriptionPh: "役割と成果を簡単に説明してください",
    },
    educations: {
      title: "学歴",
      description: "学校、学位、専攻を追加します。",
      school: "学校名",
      degree: "学位",
      field: "専攻",
      startDate: "開始日",
      endDate: "終了日",
      descriptionField: "説明",
      schoolPh: "例：東京大学",
      degreePh: "例：理学士",
      fieldPh: "例：コンピューターサイエンス",
      descriptionPh: "受賞、活動、ハイライト",
    },
    certifications: {
      title: "資格",
      description: "資格情報と任意の証明書画像を追加します。",
      name: "資格名",
      organization: "発行機関",
      issueDate: "発行日",
      expirationDate: "有効期限",
      credentialId: "資格ID",
      credentialUrl: "資格URL",
      certificateImage: "証明書画像",
      uploadImage: "証明書をアップロード",
      replaceImage: "画像を変更",
      removeImage: "画像を削除",
      namePh: "例：AWS Solutions Architect",
      organizationPh: "例：Amazon Web Services",
      credentialIdPh: "任意のIDまたはライセンス番号",
      credentialUrlPh: "https://...",
    },
    accomplishments: {
      title: "実績",
      description: "Projects, publications, patents, awards, and courses.",
      type: "Type",
      titleField: "タイトル",
      date: "Date",
      url: "URL",
      descriptionField: "説明",
      titlePh: "e.g. Open-source library maintainer",
      urlPh: "https://...",
      descriptionPh: "Context, impact, or details",
      types: {
        project: "Project",
        publication: "Publication",
        patent: "Patent",
        award: "Award",
        course: "Course",
      } satisfies Record<AccomplishmentType, string>,
    },
    creatorGate: {
      experiences: {
        title: "Work experience is for Creators",
        description:
          "Upgrade to a Creator account to add work history and showcase your professional background on your profile.",
      },
      educations: {
        title: "Education is for Creators",
        description:
          "Upgrade to a Creator account to list schools, degrees, and academic achievements.",
      },
      certifications: {
        title: "Certifications are for Creators",
        description:
          "Upgrade to a Creator account to add credentials and certificate images to your profile.",
      },
      accomplishments: {
        title: "Accomplishments are for Creators",
        description:
          "Upgrade to a Creator account to highlight projects, publications, patents, and awards.",
      },
      cta: "Apply to become a Creator",
    },
  },
  ja: {
    save: "保存",
    saving: "保存中...",
    addItem: "項目を追加",
    removeItem: "削除",
    emptyTitle: "まだ項目がありません",
    emptyDescription: "最初の項目を追加してプロフィールに表示しましょう。",
    genericError: "問題が発生しました。もう一度お試しください。",
    unauthorized: "続行するにはログインしてください。",
    saved: "変更を保存しました",
    experiences: {
      title: "職歴",
      description:
        "役職・会社・期間を追加します。公開プロフィールに表示されます。",
      company: "会社名",
      titleField: "役職",
      location: "勤務地",
      startDate: "開始日",
      endDate: "終了日",
      isCurrent: "現在も在籍中",
      descriptionField: "説明",
      companyPh: "例：株式会社 Acme",
      titlePh: "例：シニアエンジニア",
      locationPh: "例：東京都",
      descriptionPh: "担当業務や成果の概要",
    },
    educations: {
      title: "学歴",
      description: "学校・学位・専攻を追加します。",
      school: "学校名",
      degree: "学位",
      field: "専攻",
      startDate: "開始日",
      endDate: "終了日",
      descriptionField: "説明",
      schoolPh: "例：東京大学",
      degreePh: "例：学士（理学）",
      fieldPh: "例：コンピュータサイエンス",
      descriptionPh: "表彰・活動など",
    },
    certifications: {
      title: "資格・認定",
      description: "資格情報と証明書画像（任意）を追加します。",
      name: "資格名",
      organization: "発行機関",
      issueDate: "取得日",
      expirationDate: "有効期限",
      credentialId: "資格 ID",
      credentialUrl: "資格 URL",
      certificateImage: "証明書画像",
      uploadImage: "証明書をアップロード",
      replaceImage: "画像を差し替え",
      removeImage: "画像を削除",
      namePh: "例：AWS Solutions Architect",
      organizationPh: "例：Amazon Web Services",
      credentialIdPh: "任意の ID またはライセンス番号",
      credentialUrlPh: "https://...",
    },
    accomplishments: {
      title: "実績",
      description: "プロジェクト、論文、特許、受賞、コースなど。",
      type: "種類",
      titleField: "タイトル",
      date: "日付",
      url: "URL",
      descriptionField: "説明",
      titlePh: "例：OSS メンテナ",
      urlPh: "https://...",
      descriptionPh: "背景・インパクト・詳細",
      types: {
        project: "プロジェクト",
        publication: "出版物",
        patent: "特許",
        award: "受賞",
        course: "コース",
      } satisfies Record<AccomplishmentType, string>,
    },
    creatorGate: {
      experiences: {
        title: "職歴はクリエイター向け機能です",
        description:
          "クリエイターアカウントにアップグレードすると、職歴をプロフィールに表示できます。",
      },
      educations: {
        title: "学歴はクリエイター向け機能です",
        description:
          "クリエイターアカウントにアップグレードすると、学歴を追加できます。",
      },
      certifications: {
        title: "資格はクリエイター向け機能です",
        description:
          "クリエイターアカウントにアップグレードすると、資格と証明書画像を追加できます。",
      },
      accomplishments: {
        title: "実績はクリエイター向け機能です",
        description:
          "クリエイターアカウントにアップグレードすると、プロジェクトや受賞歴などを追加できます。",
      },
      cta: "クリエイターに申請",
    },
  },
} as const;

export type SettingsCvSection =
  | "experiences"
  | "educations"
  | "certifications"
  | "accomplishments";

export function getSettingsCvCommonLabel(
  key: keyof Pick<
    (typeof LABELS)["en"],
    | "save"
    | "saving"
    | "addItem"
    | "removeItem"
    | "emptyTitle"
    | "emptyDescription"
    | "genericError"
    | "unauthorized"
    | "saved"
  >,
  language: AppLanguage = "en"
): string {
  return LABELS[language][key];
}

export function getSettingsCvSectionLabels<S extends SettingsCvSection>(
  section: S,
  language: AppLanguage = "en"
): (typeof LABELS)[AppLanguage][S] {
  return LABELS[language][section];
}

export function getSettingsCreatorGateLabels(
  section: SettingsCvSection,
  language: AppLanguage = "en"
) {
  return {
    ...LABELS[language].creatorGate[section],
    cta: LABELS[language].creatorGate.cta,
  };
}

"use client";

import Link from "next/link";
import { PenLine, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AppLanguage } from "@/core/api/types/enums";

import {
  getSettingsCreatorGateLabels,
  type SettingsCvSection,
} from "../../lib/settings-cv-labels";

interface SettingsCreatorGateProps {
  section: SettingsCvSection;
  isCreator: boolean;
  language?: AppLanguage;
  children: React.ReactNode;
}

export function SettingsCreatorGate({
  section,
  isCreator,
  language = "en",
  children,
}: SettingsCreatorGateProps) {
  if (isCreator) {
    return <>{children}</>;
  }

  const labels = getSettingsCreatorGateLabels(section, language);

  return (
    <Card className='SettingsCreatorGate gap-0 overflow-hidden rounded-2xl py-0'>
      <div className='border-border flex min-h-14 items-center border-b px-6'>
        <h1 className='text-base leading-none font-semibold'>{labels.title}</h1>
      </div>
      <div className='flex flex-col items-center px-6 py-12 text-center'>
        <div className='bg-primary/10 text-primary mb-4 flex size-14 items-center justify-center rounded-2xl'>
          <Sparkles className='size-7' aria-hidden />
        </div>
        <p className='max-w-md text-sm leading-relaxed'>{labels.description}</p>
        <Button className='mt-6 rounded-full px-6' asChild>
          <Link href='/profile/become-creator'>
            <PenLine className='size-4' aria-hidden />
            {labels.cta}
          </Link>
        </Button>
      </div>
    </Card>
  );
}

"use client";

import dynamic from "next/dynamic";

import { FacebookLoginButton } from "./social/FacebookLoginButton";
import { GoogleLoginButton } from "./social/GoogleLoginButton";
import { InstagramLoginButton } from "./social/InstagramLoginButton";
import { LineLoginButton } from "./social/LineLoginButton";
import { GithubLoginButton } from "./social/GithubLoginButton";
import { SocialLoginDivider } from "./SocialLoginDivider";

interface SocialLoginSectionProps {
  disabled?: boolean;
  onError?: (message: string) => void;
  onSuccess?: (redirectTo: string) => void;
}

function SocialLoginSectionContent({
  disabled = false,
  onError,
  onSuccess,
}: SocialLoginSectionProps) {
  return (
    <>
      <SocialLoginDivider />
      <div className='SocialLoginSection flex justify-center gap-4'>
        <GoogleLoginButton
          disabled={disabled}
          onError={onError}
          onSuccess={onSuccess}
        />
        <FacebookLoginButton disabled onError={onError} />
        <InstagramLoginButton disabled onError={onError} />
        <LineLoginButton disabled onError={onError} />
        <GithubLoginButton disabled onError={onError} />
      </div>
    </>
  );
}

export const SocialLoginSection = dynamic(
  () => Promise.resolve({ default: SocialLoginSectionContent }),
  {
    ssr: false,
    loading: () => <div className='my-4 h-14' aria-hidden />,
  }
);

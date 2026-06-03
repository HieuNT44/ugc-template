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
}

function SocialLoginSectionContent({
  disabled = false,
  onError,
}: SocialLoginSectionProps) {
  return (
    <>
      <SocialLoginDivider />
      <div className='SocialLoginSection flex justify-center gap-4'>
        <GoogleLoginButton disabled={disabled} onError={onError} />
        <FacebookLoginButton disabled={disabled} onError={onError} />
        <InstagramLoginButton disabled={disabled} onError={onError} />
        <LineLoginButton disabled={disabled} onError={onError} />
        <GithubLoginButton disabled={disabled} onError={onError} />
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

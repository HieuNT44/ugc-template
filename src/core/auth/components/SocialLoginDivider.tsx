"use client";

export function SocialLoginDivider() {
  return (
    <div className='SocialLoginDivider my-4'>
      <div className='flex items-center gap-3'>
        <div className='w-full border-t' />
        <span className='text-muted-foreground shrink-0 text-sm'>
          または以下で続行
        </span>
        <div className='w-full border-t' />
      </div>
    </div>
  );
}

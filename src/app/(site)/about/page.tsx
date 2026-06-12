import { SITE_DESCRIPTION, SITE_NAME } from "@/features/site";

export default function AboutPage() {
  return (
    <div className='About mx-auto w-full max-w-3xl px-6 py-10'>
      <h1 className='font-serif text-3xl font-bold'>{SITE_NAME}について</h1>
      <p className='text-muted-foreground mt-4 leading-relaxed'>
        {SITE_DESCRIPTION}
      </p>
    </div>
  );
}

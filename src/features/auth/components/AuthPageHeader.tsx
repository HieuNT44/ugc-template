interface AuthPageHeaderProps {
  title: string;
  description: string;
}

export function AuthPageHeader({ title, description }: AuthPageHeaderProps) {
  return (
    <div className='AuthPageHeader mb-6'>
      <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
      <p className='text-muted-foreground mt-2 text-sm'>{description}</p>
    </div>
  );
}

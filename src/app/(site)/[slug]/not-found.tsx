import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className='PostNotFound mx-auto flex w-full max-w-lg flex-col items-center px-6 py-20 text-center'>
      <h1 className='font-serif text-3xl font-bold tracking-tight'>
        Story not found
      </h1>
      <p className='text-muted-foreground mt-3 leading-relaxed'>
        This story may have been removed or the link is incorrect.
      </p>
      <Link
        href='/'
        className='text-foreground focus-visible:ring-ring/50 mt-8 font-medium underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:outline-none'
      >
        Back to home
      </Link>
    </div>
  );
}

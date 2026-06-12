import Link from "next/link";

export default function PublicProfileNotFound() {
  return (
    <div className='PublicProfileNotFound mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-16 text-center'>
      <h1 className='text-foreground text-2xl font-semibold'>
        プロフィールが見つかりません
      </h1>
      <p className='text-muted-foreground mt-2 text-sm'>
        このユーザーは存在しないか、プロフィールが公開されていません。
      </p>
      <Link
        href='/explore'
        className='text-primary mt-6 text-sm font-medium underline underline-offset-4'
      >
        RealReadを探索
      </Link>
    </div>
  );
}

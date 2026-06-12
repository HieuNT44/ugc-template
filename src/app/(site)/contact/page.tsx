export default function ContactPage() {
  return (
    <div className='Contact mx-auto w-full max-w-3xl px-6 py-10'>
      <h1 className='font-serif text-3xl font-bold'>お問い合わせ</h1>
      <p className='text-muted-foreground mt-4 leading-relaxed'>
        RealReadチームへのお問い合わせは{" "}
        <a
          href='mailto:hello@realread.app'
          className='text-foreground underline underline-offset-4'
        >
          hello@realread.app
        </a>
        .
      </p>
    </div>
  );
}

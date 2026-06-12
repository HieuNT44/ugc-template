import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import { authOptions } from "@/core/auth";
import { BookDetailView } from "@/features/reading/components/BookDetailView";
import { StripePurchaseReturnSync } from "@/features/reading/components/StripePurchaseReturnSync";
import { fulfillPostPurchaseFromStripeSession } from "@/features/reading/lib/fulfill-post-purchase";
import { getBookDetailFromApi } from "@/features/reading/lib/get-book-detail-from-api";

export const dynamic = "force-dynamic";

type BookDetailPageProps = {
  params: Promise<{
    username: string;
    id: string;
  }>;
  searchParams: Promise<{
    chapter?: string;
    session_id?: string;
    stripe?: string;
  }>;
};

export async function generateMetadata({
  params,
}: Pick<BookDetailPageProps, "params">): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookDetailFromApi(id);

  if (!book) {
    return {
      title: "ブックが見つかりません",
    };
  }

  return {
    title: `${book.title} | RealRead`,
    description: book.description || book.shortDescription || book.excerpt,
  };
}

export default async function BookDetailPage({
  params,
  searchParams,
}: BookDetailPageProps) {
  const { username: rawUsername, id } = await params;
  const query = await searchParams;
  const username = decodeURIComponent(rawUsername);
  const session = await getServerSession(authOptions);
  let book = await getBookDetailFromApi(id, session?.accessToken);

  if (!book) {
    notFound();
  }

  let purchaseSuccess = false;

  if (
    book.isPaid &&
    book.access !== "full" &&
    session?.user?.id &&
    query.stripe === "success" &&
    query.session_id
  ) {
    noStore();

    const fulfilled = await fulfillPostPurchaseFromStripeSession({
      sessionId: query.session_id,
      expectedUserId: session.user.id,
      expectedPostId: book.id,
      useBackend: true,
    });

    if (fulfilled) {
      const refreshed = await getBookDetailFromApi(id, session.accessToken, {
        fresh: true,
      });
      if (refreshed) {
        book = refreshed;
        purchaseSuccess = refreshed.access === "full";
      }
    }
  }

  return (
    <>
      <StripePurchaseReturnSync
        stripe={query.stripe}
        sessionId={query.session_id}
        contentId={book.id}
      />
      <BookDetailView
        book={book}
        username={username}
        selectedChapterId={query.chapter}
        purchaseSuccess={purchaseSuccess}
        stripeCanceled={query.stripe === "canceled"}
      />
    </>
  );
}

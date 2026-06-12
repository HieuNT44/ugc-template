import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import { authOptions } from "@/core/auth";
import { isPaidPost } from "@/core/lib/post-labels";
import { PostArticleView } from "@/features/reading/components/PostArticleView";
import { StripePurchaseReturnSync } from "@/features/reading/components/StripePurchaseReturnSync";
import { fulfillPostPurchaseFromStripeSession } from "@/features/reading/lib/fulfill-post-purchase";
import { getPostArticleFromApi } from "@/features/reading/lib/get-post-article-from-api";
import { getPostArticleBySlug } from "@/features/reading/lib/mock-post-articles";
import { hasUserPurchasedPost } from "@/features/reading/lib/post-purchase-repository";
import { SITE_NAME } from "@/features/site";

export const dynamic = "force-dynamic";

type PostPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    session_id?: string;
    stripe?: string;
  }>;
};

export async function generateMetadata({
  params,
}: Pick<PostPageProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const article = getPostArticleBySlug(slug);

  if (!article) {
    return { title: "記事が見つかりません" };
  }

  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.snippet,
    openGraph: {
      title: article.title,
      description: article.snippet,
      type: "article",
      authors: [article.authorDisplayName],
    },
  };
}

export default async function PostPage({
  params,
  searchParams,
}: PostPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const session = await getServerSession(authOptions);
  const mockArticle = getPostArticleBySlug(slug);
  const apiArticleResult = mockArticle
    ? null
    : await getPostArticleFromApi(slug, session?.accessToken);
  let article = mockArticle ?? apiArticleResult?.article ?? null;

  if (!article) {
    notFound();
  }

  const userId = session?.user?.id;
  const paid = isPaidPost(article.labels);

  let isUnlocked = apiArticleResult?.isUnlocked ?? !paid;
  let purchaseSuccess = false;
  let likedByMe = apiArticleResult?.likedByMe ?? false;
  let savedByMe = apiArticleResult?.savedByMe ?? false;

  if (paid && userId && mockArticle) {
    isUnlocked = await hasUserPurchasedPost(userId, article.id);
  }

  if (
    paid &&
    !isUnlocked &&
    userId &&
    query.stripe === "success" &&
    query.session_id
  ) {
    noStore();

    const fulfilled = await fulfillPostPurchaseFromStripeSession({
      sessionId: query.session_id,
      expectedUserId: userId,
      expectedPostId: article.id,
      useBackend: !mockArticle,
    });

    if (fulfilled && mockArticle) {
      isUnlocked = true;
      purchaseSuccess = true;
    }

    if (fulfilled && !mockArticle) {
      const refreshed = await getPostArticleFromApi(
        slug,
        session?.accessToken,
        {
          fresh: true,
        }
      );
      if (refreshed) {
        article = refreshed.article;
        isUnlocked = refreshed.isUnlocked;
        purchaseSuccess = refreshed.isUnlocked;
        likedByMe = refreshed.likedByMe;
        savedByMe = refreshed.savedByMe;
      }
    }
  }

  const apiEngagement = !mockArticle;

  return (
    <>
      <StripePurchaseReturnSync
        stripe={query.stripe}
        sessionId={query.session_id}
        contentId={article.id}
      />
      <PostArticleView
        article={article}
        isUnlocked={isUnlocked}
        stripeCanceled={query.stripe === "canceled"}
        purchaseSuccess={purchaseSuccess}
        useApiEngagement={apiEngagement}
        likedByMe={likedByMe}
        savedByMe={savedByMe}
        currentReader={
          session?.user
            ? {
                name: session.user.name ?? "読者",
                avatarUrl: session.user.image ?? undefined,
              }
            : undefined
        }
      />
    </>
  );
}

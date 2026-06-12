import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/core/auth";
import { getBaseUrl } from "@/core/lib/get-base-url";
import { getPaidLabel, isPaidPost } from "@/core/lib/post-labels";
import { createStripeCheckoutSession } from "@/features/payment/stripe";
import { toStripeUnitAmount } from "@/features/payment/stripe/amount";
import { getContentForCheckout } from "@/features/reading/lib/get-content-for-checkout";
import { getPostArticleById } from "@/features/reading/lib/mock-post-articles";
import { postCheckoutSchema } from "@/features/reading/validations/post-checkout.schema";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const accessToken = session?.accessToken;

    if (!userId || !accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = postCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { postId, postSlug } = parsed.data;
    const mockArticle = getPostArticleById(postId);
    const apiContent = mockArticle
      ? null
      : await getContentForCheckout(postId, accessToken);

    if (!mockArticle && !apiContent) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (apiContent?.alreadyPurchased) {
      return NextResponse.json({ error: "Already purchased" }, { status: 409 });
    }

    const title = mockArticle?.title ?? apiContent?.title ?? "Untitled";
    const currency = apiContent?.currency ?? "USD";
    const listedPrice = mockArticle
      ? (getPaidLabel(mockArticle.labels)?.amountCents ?? null)
      : (apiContent?.price ?? null);

    if (mockArticle && !isPaidPost(mockArticle.labels)) {
      return NextResponse.json({ error: "Post is not paid" }, { status: 400 });
    }

    if (mockArticle && mockArticle.slug !== postSlug) {
      return NextResponse.json({ error: "Invalid post slug" }, { status: 400 });
    }

    if (listedPrice == null || listedPrice <= 0) {
      return NextResponse.json({ error: "Post is not paid" }, { status: 400 });
    }

    const stripeAmount = toStripeUnitAmount(listedPrice, currency);
    const baseUrl = getBaseUrl(request);
    const successUrl = `${baseUrl}/${postSlug}?session_id={CHECKOUT_SESSION_ID}&stripe=success`;
    const cancelUrl = `${baseUrl}/${postSlug}?stripe=canceled`;

    const result = await createStripeCheckoutSession(
      {
        amount: stripeAmount,
        currency: currency.toLowerCase(),
        productName: title,
        customerEmail: session.user.email ?? undefined,
        clientReferenceId: `${userId}:${postId}`,
        metadata: {
          userId,
          contentId: postId,
          postId,
        },
      },
      { successUrl, cancelUrl }
    );

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ url: result.url });
  } catch (err) {
    console.error("Stripe post checkout POST error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

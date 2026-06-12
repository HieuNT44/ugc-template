import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/core/auth";
import { fulfillPostPurchaseFromStripeSession } from "@/features/reading/lib/fulfill-post-purchase";
import { stripeFulfillReturnSchema } from "@/features/reading/validations/stripe-fulfill-return.schema";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = stripeFulfillReturnSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ?? "リクエストが正しくありません",
        },
        { status: 400 }
      );
    }

    const { sessionId, postId } = parsed.data;
    const fulfilled = await fulfillPostPurchaseFromStripeSession({
      sessionId,
      expectedUserId: userId,
      expectedPostId: postId,
      useBackend: true,
    });

    return NextResponse.json({ fulfilled });
  } catch (error) {
    console.error("Stripe fulfill-return POST error:", error);
    return NextResponse.json(
      { error: "購入を完了できませんでした" },
      { status: 500 }
    );
  }
}

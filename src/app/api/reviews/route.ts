import { NextRequest, NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";
import { auth } from "../../../auth";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from the server-side session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in to submit a review.",
        },
        { status: 401 }
      );
    }

    // Never trust userId sent by the browser
    const userId = session.user.id;

    const body = await request.json();

    const productId = String(body.productId || "").trim();
    const title = String(body.title || "").trim();
    const comment = String(body.comment || "").trim();
    const rating = Number(body.rating);

    if (!productId || !comment) {
      return NextResponse.json(
        {
          success: false,
          error: "Product and review comment are required.",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: "Rating must be between 1 and 5.",
        },
        { status: 400 }
      );
    }

    // Make sure the product actually exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    // One review per user per product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already reviewed this product.",
        },
        { status: 409 }
      );
    }

    // Determine whether this user actually purchased the product
    const purchasedItem = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: {
            in: ["PAID", "COMPLETED"],
          },
        },
      },
      select: {
        id: true,
      },
    });

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title: title || null,
        comment,
        isVerifiedPurchase: Boolean(purchasedItem),
        isApproved: true,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_REVIEW_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to submit review.",
      },
      { status: 500 }
    );
  }
}
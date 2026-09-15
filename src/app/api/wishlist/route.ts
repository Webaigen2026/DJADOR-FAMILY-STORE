import { NextRequest, NextResponse } from "next/server";

import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    const userId = (
      session?.user as { id?: string } | undefined
    )?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Please sign in to view your wishlist.",
        },
        { status: 401 }
      );
    }

    const items = await prisma.wishlistItem.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (error) {
    console.error("GET /api/wishlist error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load your wishlist.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    const userId = (
      session?.user as { id?: string } | undefined
    )?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Please sign in to add items to your wishlist.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId =
      typeof body.productId === "string"
        ? body.productId.trim()
        : "";

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "This product is unavailable.",
        },
        { status: 404 }
      );
    }

    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {},
      create: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    const count = await prisma.wishlistItem.count({
      where: {
        userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Added to wishlist.",
        item,
        count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/wishlist error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to add this product to your wishlist.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    const userId = (
      session?.user as { id?: string } | undefined
    )?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Please sign in to manage your wishlist.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId =
      typeof body.productId === "string"
        ? body.productId.trim()
        : "";

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          error: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    await prisma.wishlistItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    const count = await prisma.wishlistItem.count({
      where: {
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist.",
      count,
    });
  } catch (error) {
    console.error("DELETE /api/wishlist error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to remove this product from your wishlist.",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";

import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { itemId, quantity } = await req.json();

    if (
      !itemId ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        { error: "Invalid itemId or quantity" },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: {
        product: true,
        variant: true,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (!existingItem.product.isActive) {
      return NextResponse.json(
        { error: "This product is no longer available." },
        { status: 409 }
      );
    }

    let availableStock = existingItem.product.stock;

    if (existingItem.variantId) {
      if (
        !existingItem.variant ||
        !existingItem.variant.isActive
      ) {
        return NextResponse.json(
          {
            error:
              "The selected product option is no longer available.",
          },
          { status: 409 }
        );
      }

      availableStock = existingItem.variant.stock;
    }

    if (quantity > availableStock) {
      return NextResponse.json(
        {
          error: `Only ${availableStock} item${
            availableStock === 1 ? "" : "s"
          } available.`,
        },
        { status: 409 }
      );
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
        variant: true,
      },
    });

    return NextResponse.json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}
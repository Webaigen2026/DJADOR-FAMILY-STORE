import { NextResponse } from "next/server";

import { auth } from "../../../../../auth";
import { prisma } from "../../../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();

    const userId = (
      session?.user as { id?: string } | undefined
    )?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Please sign in to use Buy Again.",
        },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    // Only allow the logged-in user to reorder their own order.
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found.",
        },
        { status: 404 }
      );
    }

    if (order.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "This order does not contain any items.",
        },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (transaction: any) => {
      const cart = await transaction.cart.upsert({
        where: {
          userId,
        },
        update: {},
        create: {
          userId,
        },
      });

      for (const orderItem of order.items) {
        // Always check the CURRENT product state.
        const product = await transaction.product.findUnique({
          where: {
            id: orderItem.productId,
          },
          include: {
            variants: {
              where: {
                isActive: true,
              },
            },
          },
        });

        if (!product || !product.isActive) {
          throw new Error(
            `${orderItem.productName || "A product"} is no longer available.`
          );
        }

        let variant:
          | {
              id: string;
              size: string | null;
              color: string | null;
              stock: number;
              isActive: boolean;
            }
          | null = null;

        // If original purchase used a variant,
        // make sure that exact variant still exists.
        if (orderItem.variantId) {
          variant = await transaction.productVariant.findFirst({
            where: {
              id: orderItem.variantId,
              productId: orderItem.productId,
            },
            select: {
              id: true,
              size: true,
              color: true,
              stock: true,
              isActive: true,
            },
          });

          if (!variant || !variant.isActive) {
            throw new Error(
              `The selected option for ${
                orderItem.productName || "a product"
              } is no longer available.`
            );
          }
        } else if (product.variants.length > 0) {
          throw new Error(
            `${
              orderItem.productName || "A product"
            } now requires you to select new options.`
          );
        }

        const selectedSize =
          variant?.size || orderItem.size || null;

        const selectedColor =
          variant?.color || orderItem.color || null;

        const selectionKey = variant
          ? variant.id
          : `${selectedColor || "default"}-${
              selectedSize || "default"
            }`;

        const availableStock = variant
          ? variant.stock
          : product.stock;

        if (availableStock <= 0) {
          throw new Error(
            `${
              orderItem.productName || product.name
            } is currently out of stock.`
          );
        }

        const existingCartItem =
          await transaction.cartItem.findUnique({
            where: {
              cartId_productId_selectionKey: {
                cartId: cart.id,
                productId: orderItem.productId,
                selectionKey,
              },
            },
          });

        const existingQuantity =
          existingCartItem?.quantity || 0;

        const newQuantity =
          existingQuantity + orderItem.quantity;

        if (newQuantity > availableStock) {
          throw new Error(
            `Only ${availableStock} ${
              availableStock === 1 ? "item is" : "items are"
            } available for ${
              orderItem.productName || product.name
            }.`
          );
        }

        await transaction.cartItem.upsert({
          where: {
            cartId_productId_selectionKey: {
              cartId: cart.id,
              productId: orderItem.productId,
              selectionKey,
            },
          },
          update: {
            quantity: newQuantity,
            variantId: variant?.id || null,
            selectedSize,
            selectedColor,
          },
          create: {
            cartId: cart.id,
            productId: orderItem.productId,
            variantId: variant?.id || null,
            selectedSize,
            selectedColor,
            selectionKey,
            quantity: orderItem.quantity,
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Items added to your cart.",
    });
  } catch (error) {
    console.error(
      "POST /api/orders/[orderId]/buy-again error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to add this order to your cart.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 409 }
    );
  }
}
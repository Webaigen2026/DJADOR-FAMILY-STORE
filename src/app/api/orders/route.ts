import { NextRequest, NextResponse } from "next/server";

import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";
import { sendOrderReceivedEmail } from "../../../lib/email";

type CreateOrderBody = {
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    let body: CreateOrderBody = {};

    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const shippingName = String(body.shippingName || "").trim();
    const shippingPhone = String(body.shippingPhone || "").trim();
    const shippingAddress = String(body.shippingAddress || "").trim();
    const shippingCity = String(body.shippingCity || "").trim();
    const shippingState = String(body.shippingState || "").trim();
    const shippingZip = String(body.shippingZip || "").trim();

    if (
      !shippingName ||
      !shippingPhone ||
      !shippingAddress ||
      !shippingCity ||
      !shippingState ||
      !shippingZip
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Complete shipping information is required.",
        },
        { status: 400 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart is empty",
        },
        { status: 400 }
      );
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: `${item.product.name} is no longer available.`,
          },
          { status: 409 }
        );
      }

      if (item.variantId) {
        if (!item.variant || !item.variant.isActive) {
          return NextResponse.json(
            {
              success: false,
              error: `A selected option for ${item.product.name} is no longer available.`,
            },
            { status: 409 }
          );
        }

        if (item.quantity > item.variant.stock) {
          return NextResponse.json(
            {
              success: false,
              error: `Only ${item.variant.stock} of the selected ${item.product.name} option available.`,
            },
            { status: 409 }
          );
        }
      } else if (item.quantity > item.product.stock) {
        return NextResponse.json(
          {
            success: false,
            error: `Only ${item.product.stock} ${item.product.name} available.`,
          },
          { status: 409 }
        );
      }
    }

    const orderItems = cart.items.map((item) => {
      const unitPrice =
        item.variant?.price !== null &&
        item.variant?.price !== undefined
          ? item.variant.price
          : item.product.price;

      return {
        productId: item.productId,
        variantId: item.variantId,
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
        unitPrice,
        productName: item.product.name,
        sku: item.variant?.sku || null,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: "PENDING_PAYMENT",
          paymentStatus: "PENDING",

          shippingName,
          shippingPhone,
          shippingAddress,
          shippingCity,
          shippingState,
          shippingZip,

          items: {
            create: orderItems,
          },
        },

        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          payments: true,
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return createdOrder;
    });

    // Send order received email after the order has been created.
    // Email failure must not cause the successfully created order to fail.
    const customerEmail = session.user?.email;

    if (customerEmail) {
      try {
        await sendOrderReceivedEmail({
          email: customerEmail,
          orderId: order.id,
          customerName: shippingName,
          totalAmount: order.totalAmount,
          shippingAddress,
          shippingCity,
          shippingState,
          shippingZip,
          items: order.items.map((item) => ({
            productName: item.productName || "",
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            size: item.size,
            color: item.color,
          })),
        });
      } catch (emailError) {
        console.error(
          "Order created successfully, but order email failed:",
          emailError
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
      },
      { status: 500 }
    );
  }
}
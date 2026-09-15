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

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Security:
     * The user can only cancel an order that belongs
     * to their own account.
     */
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * For the current checkout implementation,
     * customer cancellation is allowed only while
     * the order is still waiting for payment.
     *
     * Once payment/order processing is implemented,
     * cancellation rules can be expanded separately.
     */
    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        {
          success: false,
          error:
            "This order can no longer be cancelled.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Important:
     * We currently DO NOT restore product inventory
     * here because unpaid order creation does not
     * decrement inventory.
     */

    const cancelledOrder = await prisma.order.updateMany({
      where: {
        id: order.id,
        userId: session.user.id,
        status: "PENDING_PAYMENT",
      },
      data: {
        status: "CANCELLED",
      },
    });

    /*
     * updateMany also protects against a race where
     * the order status changed between the read and
     * update.
     */
    if (cancelledOrder.count !== 1) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The order status changed and it can no longer be cancelled.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully.",
      order: {
        id: order.id,
        status: "CANCELLED",
      },
    });
  } catch (error) {
    console.error("CANCEL_ORDER_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while cancelling the order.",
      },
      {
        status: 500,
      }
    );
  }
}
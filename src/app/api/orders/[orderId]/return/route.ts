import { NextResponse } from "next/server";

import { auth } from "../../../../../auth";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  _request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { orderId } = await context.params;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      select: {
        id: true,
        status: true,
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

    if (order.status !== "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          error: "This order is not eligible for a return.",
        },
        { status: 409 }
      );
    }

    const result = await prisma.order.updateMany({
      where: {
        id: order.id,
        userId: session.user.id,
        status: "COMPLETED",
      },
      data: {
        status: "RETURN_REQUESTED",
      },
    });

    if (result.count !== 1) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The order status changed. Please refresh and try again.",
        },
        { status: 409 }
      );
    }

    // Create notification after successful return request.
    const orderNumber = order.id.slice(-8).toUpperCase();

    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "Return requested",
        message: `Your return request for order #${orderNumber} has been submitted successfully.`,
        type: "RETURN_REQUESTED",
        href: `/account/orders/${order.id}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Return request submitted successfully.",
    });
  } catch (error) {
    console.error("POST order return request error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to submit return request.",
      },
      { status: 500 }
    );
  }
}
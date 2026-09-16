import { NextResponse } from "next/server";

import { auth } from "../../../../../auth";
import { prisma } from "../../../../../lib/prisma";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const result = await prisma.notification.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        isRead: true,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Notification not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("PATCH /api/notifications/[id]/read error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update notification",
      },
      { status: 500 }
    );
  }
}
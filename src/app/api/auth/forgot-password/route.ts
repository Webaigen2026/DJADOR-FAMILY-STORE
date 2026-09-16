import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";

import { prisma } from "../../../../lib/prisma";
import { sendPasswordResetEmail } from "../../../../lib/email";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return the same response when the user does not exist.
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If the email exists, a reset link has been sent.",
      });
    }

    // Prevent repeated password-reset emails.
    const latestResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (latestResetToken) {
      const cooldownMs = 60 * 1000;
      const elapsedMs =
        Date.now() - latestResetToken.createdAt.getTime();

      if (elapsedMs < cooldownMs) {
        const retryAfter = Math.ceil(
          (cooldownMs - elapsedMs) / 1000
        );

        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${retryAfter} seconds before requesting another reset link.`,
          },
          {
            status: 429,
            headers: {
              "Retry-After": retryAfter.toString(),
            },
          }
        );
      }
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({
      success: true,
      message: "If the email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to process forgot password." },
      { status: 500 }
    );
  }
}
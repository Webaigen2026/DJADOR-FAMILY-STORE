import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "../../../../lib/prisma";
import { sendVerificationOtpEmail } from "../../../../lib/email";

const resendOtpSchema = z.object({
  email: z.string().email(),
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = resendOtpSchema.safeParse(body);

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

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Email already verified." },
        { status: 400 }
      );
    }

    // Prevent repeated OTP email requests.
    const latestOtp = await prisma.oTPCode.findFirst({
      where: {
        userId: user.id,
        email,
        type: "EMAIL_VERIFICATION",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (latestOtp) {
      const cooldownMs = 60 * 1000;
      const elapsedMs = Date.now() - latestOtp.createdAt.getTime();

      if (elapsedMs < cooldownMs) {
        const retryAfter = Math.ceil(
          (cooldownMs - elapsedMs) / 1000
        );

        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${retryAfter} seconds before requesting another code.`,
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

    const otp = generateOtp();

    await prisma.oTPCode.create({
      data: {
        userId: user.id,
        email,
        code: otp,
        type: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    await sendVerificationOtpEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: "Verification code resent successfully.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to resend verification code." },
      { status: 500 }
    );
  }
}
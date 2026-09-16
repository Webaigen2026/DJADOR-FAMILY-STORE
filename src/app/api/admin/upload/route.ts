import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Require authenticated ADMIN user
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Admin access required",
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        {
          error: "No files uploaded",
        },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    // Production upload validation
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    const maxFileSize = 10 * 1024 * 1024; // 10 MB

    for (const file of files) {
      if (!file || file.size === 0) {
        continue;
      }

      // Only allow supported image formats
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            error: `Unsupported image type: ${file.name}`,
          },
          { status: 400 }
        );
      }

      // Maximum 10 MB per image
      if (file.size > maxFileSize) {
        return NextResponse.json(
          {
            error: `Image is too large: ${file.name}. Maximum size is 10 MB.`,
          },
          { status: 400 }
        );
      }

      const safeName = file.name
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9.-]/g, "");

      const blob = await put(
        `products/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}-${safeName}`,
        file,
        {
          access: "public",
        }
      );

      urls.push(blob.url);
    }

    return NextResponse.json({
      urls,
    });
  } catch (error) {
    console.error("POST /api/admin/upload error:", error);

    return NextResponse.json(
      {
        error: "Failed to upload product images",
      },
      { status: 500 }
    );
  }
}
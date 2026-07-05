import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!file || file.size === 0) continue;

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

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("UPLOAD_ERROR", error);

    return NextResponse.json(
      { error: "Image upload failed" },
      { status: 500 }
    );
  }
}
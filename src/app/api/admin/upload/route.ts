import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const urls: string[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/\s+/g, "-");

    const blob = await put(`products/${Date.now()}-${safeName}`, file, {
      access: "public",
    });

    urls.push(blob.url);
  }

  return NextResponse.json({ urls });
}
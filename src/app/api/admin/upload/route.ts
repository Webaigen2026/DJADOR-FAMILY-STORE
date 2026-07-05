import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "images", "products");
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/\s+/g, "-");
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}-${safeName}`;

    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    urls.push(`/images/products/${fileName}`);
  }

  return NextResponse.json({ urls });
}
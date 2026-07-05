import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

function makeSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const price = Number(body.price || 0);
    const originalPrice = Number(body.originalPrice || 0);
    const brand = String(body.brand || "").trim();
    const category = String(body.category || "").trim();
    const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls : [];
    const mainImageUrl = imageUrls[0] || String(body.imageUrl || "").trim();
    const stock = Number(body.stock || 0);
    const isActive = Boolean(body.isActive);

    if (!name || !description || price <= 0) {
      return NextResponse.json(
        { error: "Name, description, and price are required." },
        { status: 400 }
      );
    }

    const slug = `${makeSlug(name)}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        originalPrice: originalPrice > 0 ? originalPrice : null,
        brand: brand || null,
        category: category || null,
        imageUrl: mainImageUrl || null,
        stock,
        isActive,
        images: {
          create: imageUrls.map((url: string) => ({
            url,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR", error);

    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
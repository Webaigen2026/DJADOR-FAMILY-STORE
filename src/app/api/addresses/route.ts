import { NextResponse } from "next/server";
import { auth } from "../../../auth";
import { prisma } from "../../../lib/prisma";

// GET - Get all saved addresses for logged-in user
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("GET addresses error:", error);

    return NextResponse.json(
      { error: "Failed to load addresses" },
      { status: 500 }
    );
  }
}

// POST - Create a new saved address
export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const label =
      typeof body.label === "string" && body.label.trim()
        ? body.label.trim()
        : "Home";

    const fullName =
      typeof body.fullName === "string"
        ? body.fullName.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const address1 =
      typeof body.address1 === "string"
        ? body.address1.trim()
        : "";

    const address2 =
      typeof body.address2 === "string"
        ? body.address2.trim()
        : "";

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : "";

    const state =
      typeof body.state === "string"
        ? body.state.trim()
        : "";

    const zip =
      typeof body.zip === "string"
        ? body.zip.trim()
        : "";

    const country =
      typeof body.country === "string" && body.country.trim()
        ? body.country.trim()
        : "United States";

    const isDefault = body.isDefault === true;

    if (
      !fullName ||
      !phone ||
      !address1 ||
      !city ||
      !state ||
      !zip
    ) {
      return NextResponse.json(
        {
          error:
            "Full name, phone, address, city, state, and ZIP code are required",
        },
        { status: 400 }
      );
    }

    const address = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.address.count({
        where: { userId },
      });

      // First saved address automatically becomes default.
      const shouldBeDefault =
        isDefault || existingCount === 0;

      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          label,
          fullName,
          phone,
          address1,
          address2: address2 || null,
          city,
          state,
          zip,
          country,
          isDefault: shouldBeDefault,
        },
      });
    });

    return NextResponse.json(
      { address },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST address error:", error);

    return NextResponse.json(
      { error: "Failed to save address" },
      { status: 500 }
    );
  }
}
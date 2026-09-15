import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// PATCH - Update an address
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const label =
      typeof body.label === "string"
        ? body.label.trim()
        : existingAddress.label;

    const fullName =
      typeof body.fullName === "string"
        ? body.fullName.trim()
        : existingAddress.fullName;

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : existingAddress.phone;

    const address1 =
      typeof body.address1 === "string"
        ? body.address1.trim()
        : existingAddress.address1;

    const address2 =
      typeof body.address2 === "string"
        ? body.address2.trim()
        : existingAddress.address2;

    const city =
      typeof body.city === "string"
        ? body.city.trim()
        : existingAddress.city;

    const state =
      typeof body.state === "string"
        ? body.state.trim()
        : existingAddress.state;

    const zip =
      typeof body.zip === "string"
        ? body.zip.trim()
        : existingAddress.zip;

    const country =
      typeof body.country === "string"
        ? body.country.trim()
        : existingAddress.country;

    const makeDefault = body.isDefault === true;

    if (
      !label ||
      !fullName ||
      !phone ||
      !address1 ||
      !city ||
      !state ||
      !zip ||
      !country
    ) {
      return NextResponse.json(
        {
          error:
            "Full name, phone, address, city, state, ZIP code, and country are required",
        },
        { status: 400 }
      );
    }

    const address = await prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.address.updateMany({
          where: {
            userId,
            id: {
              not: id,
            },
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.address.update({
        where: {
          id,
        },
        data: {
          label,
          fullName,
          phone,
          address1,
          address2: address2 || null,
          city,
          state,
          zip,
          country,

          // Don't accidentally remove the current default
          isDefault: makeDefault
            ? true
            : existingAddress.isDefault,
        },
      });
    });

    return NextResponse.json({ address });
  } catch (error) {
    console.error("PATCH address error:", error);

    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// DELETE - Remove an address
export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: "Address not found" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.address.delete({
        where: {
          id,
        },
      });

      // If default address was deleted,
      // automatically make another address default.
      if (existingAddress.isDefault) {
        const nextAddress = await tx.address.findFirst({
          where: {
            userId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (nextAddress) {
          await tx.address.update({
            where: {
              id: nextAddress.id,
            },
            data: {
              isDefault: true,
            },
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE address error:", error);

    return NextResponse.json(
      { error: "Failed to remove address" },
      { status: 500 }
    );
  }
}
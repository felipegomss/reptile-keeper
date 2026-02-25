import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, verifyPetOwnership, unauthorized, notFound } from "@/lib/api-helpers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ petId: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  const { petId } = await params;
  const pet = await prisma.pet.findFirst({
    where: { id: petId, userId: user.id },
    include: {
      weights: { orderBy: { date: "asc" } },
      feedings: { orderBy: { date: "desc" } },
      sheds: { orderBy: { date: "desc" } },
      documents: true,
      notes: { orderBy: { date: "desc" } },
    },
  });

  if (!pet) return notFound();
  return NextResponse.json(pet);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ petId: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  const { petId } = await params;
  const pet = await verifyPetOwnership(petId, user.id);
  if (!pet) return notFound();

  const body = await request.json();
  const updated = await prisma.pet.update({
    where: { id: petId },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ petId: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  const { petId } = await params;
  const pet = await verifyPetOwnership(petId, user.id);
  if (!pet) return notFound();

  await prisma.pet.delete({ where: { id: petId } });
  return NextResponse.json({ success: true });
}

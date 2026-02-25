import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthenticatedUser,
  verifyPetOwnership,
  unauthorized,
  notFound,
} from "@/lib/api-helpers";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ petId: string; weightId: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  const { petId, weightId } = await params;
  const pet = await verifyPetOwnership(petId, user.id);
  if (!pet) return notFound();

  await prisma.weightRecord.delete({
    where: { id: weightId, petId },
  });

  return NextResponse.json({ success: true });
}

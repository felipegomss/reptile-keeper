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
  { params }: { params: Promise<{ petId: string; noteId: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  const { petId, noteId } = await params;
  const pet = await verifyPetOwnership(petId, user.id);
  if (!pet) return notFound();

  await prisma.noteRecord.delete({
    where: { id: noteId, petId },
  });

  return NextResponse.json({ success: true });
}

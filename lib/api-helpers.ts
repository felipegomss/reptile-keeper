import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session.user;
}

export async function verifyPetOwnership(petId: string, userId: string) {
  const pet = await prisma.pet.findFirst({
    where: { id: petId, userId },
  });
  return pet;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function notFound() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export function badRequest(message = "Invalid input") {
  return NextResponse.json({ error: message }, { status: 400 });
}

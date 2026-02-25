import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorized, badRequest } from "@/lib/api-helpers";
import { petSchema } from "@/lib/validations";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  const pets = await prisma.pet.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(pets);
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  const count = await prisma.pet.count({ where: { userId: user.id } });
  if (count >= 3) {
    return badRequest("Limite máximo de 3 pets atingido");
  }

  const body = await request.json();
  const parsed = petSchema.safeParse(body);
  if (!parsed.success) return badRequest();

  const pet = await prisma.pet.create({
    data: { ...parsed.data, photo: parsed.data.photo ?? null, userId: user.id },
  });

  return NextResponse.json(pet, { status: 201 });
}

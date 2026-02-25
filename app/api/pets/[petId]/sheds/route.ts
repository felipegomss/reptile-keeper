import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getAuthenticatedUser,
  verifyPetOwnership,
  unauthorized,
  notFound,
  badRequest,
} from "@/lib/api-helpers";
import { shedSchema } from "@/lib/validations";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ petId: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  const { petId } = await params;
  const pet = await verifyPetOwnership(petId, user.id);
  if (!pet) return notFound();

  const records = await prisma.shedRecord.findMany({
    where: { petId },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(records);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ petId: string }> }
) {
  const user = await getAuthenticatedUser();
  if (!user) return unauthorized();

  const { petId } = await params;
  const pet = await verifyPetOwnership(petId, user.id);
  if (!pet) return notFound();

  const body = await request.json();
  const parsed = shedSchema.safeParse(body);
  if (!parsed.success) return badRequest();

  const record = await prisma.shedRecord.create({
    data: { ...parsed.data, petId },
  });

  return NextResponse.json(record, { status: 201 });
}

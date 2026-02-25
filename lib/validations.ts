import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6, "Mínimo 6 caracteres"),
});

export const petSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  morph: z.string().default(""),
  birthDate: z.string(),
  acquiredDate: z.string(),
  photo: z.string().nullable().optional(),
});

export const weightSchema = z.object({
  date: z.string(),
  weight: z.number().positive(),
});

export const feedingSchema = z.object({
  date: z.string(),
  prey: z.string().min(1),
  grams: z.number().nonnegative(),
  accepted: z.boolean(),
  notes: z.string().optional().default(""),
});

export const shedSchema = z.object({
  date: z.string(),
  quality: z.enum(["complete", "partial"]),
  notes: z.string().optional().default(""),
});

export const documentSchema = z.object({
  name: z.string().min(1),
  type: z.string().optional().default("PDF"),
  date: z.string(),
  category: z.enum(["legal", "saude"]),
});

export const noteSchema = z.object({
  date: z.string(),
  category: z.enum(["saude", "comportamento", "vet", "outro"]),
  title: z.string().min(1),
  description: z.string().optional().default(""),
  severity: z.enum(["low", "medium", "high"]).optional().default("low"),
});

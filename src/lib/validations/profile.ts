import { z } from "zod";

const passwordMessage =
  "A senha deve ter ao menos 8 caracteres, 1 letra maiúscula e 1 número.";

export const ProfileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo."),
  email: z.string().trim().email("Informe um e-mail válido."),
  avatar: z.string().trim().max(300).nullable().optional(),
});

export const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Informe sua senha atual."),
  newPassword: z
    .string()
    .min(8, passwordMessage)
    .regex(/[A-Z]/, passwordMessage)
    .regex(/[0-9]/, passwordMessage),
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof PasswordChangeSchema>;

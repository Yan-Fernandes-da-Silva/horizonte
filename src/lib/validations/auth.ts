import { z } from "zod";

const passwordMessage =
  "A senha deve ter ao menos 8 caracteres, 1 letra maiúscula e 1 número.";

export const RegisterSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome completo."),
    email: z.string().trim().email("Informe um e-mail válido."),
    password: z
      .string()
      .min(8, passwordMessage)
      .regex(/[A-Z]/, passwordMessage)
      .regex(/[0-9]/, passwordMessage),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido."),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

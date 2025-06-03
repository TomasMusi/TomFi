import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5, "Password must be atleast 5 characters long"),
})

export type LoginSchemaType = z.infer<typeof loginSchema>;


export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(5, "Password must be atleast 5 characters long"),
    name: z.string().min(3, "Name must be atlest 3 characters long "),
})

export type registerSchemaType = z.infer<typeof registerSchema>;


export const TokenSchema = z.object({
    token: z.string().min(1)
});


export type tokenSchemaType = z.infer<typeof TokenSchema>;


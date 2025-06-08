import type { Transaction } from 'kysely';
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


export const SeePinSchema = z.object({
    password: z.string().min(5, "Password must be atleast 5 characters long")
})

export type SeePinSchemaType = z.infer<typeof SeePinSchema>;


export const DepositMoney = z.object({
    money: z.number().int().min(1).max(1000)
})



export const TransactionPayment = z.object({
    card_number: z.string().length(16),
    username: z.string().min(1),
    pin: z.string().length(4),
    amount: z.number().min(1),
    category: z.array(z.string()).min(1).max(1),
    message: z.string().min(1).max(225)
})

export type TransactionPaymentType = z.infer<typeof TransactionPayment>
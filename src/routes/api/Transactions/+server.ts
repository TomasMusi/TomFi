import { TokenSchema, TransactionPayment, type TransactionPaymentType } from "$lib/zodtypes";
import type { RequestHandler } from "@sveltejs/kit";
import { db } from "../../../types/db";
import { parse } from 'cookie';
import { verifyJWT } from "../../../server/auth";

export const POST: RequestHandler = async ({ request }) => {
    const cookieHeader = request.headers.get('cookie') || '';
    // parsing the cookie
    const cookies = parse(cookieHeader)

    // validating cookies throw zod
    const result = TokenSchema.safeParse(cookies);

    // error handling
    if (!result.success) {
        return new Response(
            JSON.stringify({ error: 'Invalid data', issues: result.error.flatten() }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }


    // saving result data into variable token
    const data = await request.json();

    const transactionDataResult = TransactionPayment.safeParse(data);

    if (!transactionDataResult.success) {
        return new Response(
            JSON.stringify({ error: 'Invalid data', issues: transactionDataResult.error.flatten() }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }


    const { username, card_number, category, amount, pin, message }: TransactionPaymentType = transactionDataResult.data;


    console.log(`Tohle jest data na straně serveru:
       Jmeno: ${username}
       Karta: ${card_number}
       Category: ${category}
       Amount: ${amount}
       Pin ${pin}
       Message ${message}  `);

    // Password
    const { token } = result.data;
    const decoded = verifyJWT(token);

    const verifyPin = await db.selectFrom("Credit_card").select("pin_hash").where("user_id", "=", decoded.id).execute();

    console.log(`verifyPIN ${verifyPin}`);
    const TryDB = await db.selectFrom("Credit_card").select("user_id").where("card_number", "=", card_number).executeTakeFirst();

    console.log(`Try db ${TryDB?.user_id}`);


    // Sucess Response.
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
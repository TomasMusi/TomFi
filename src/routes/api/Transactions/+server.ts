import { TokenSchema, TransactionPayment, type TransactionPaymentType } from "$lib/zodtypes";
import type { RequestHandler } from "@sveltejs/kit";
import { db } from "../../../types/db";
import { parse } from 'cookie';
import { verifyJWT } from "../../../server/auth";
import * as fs from 'fs'
import path from "path";
import { privateDecrypt } from 'crypto';

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

    const { token } = result.data;
    const decoded = verifyJWT(token);

    // Verify if card, is not Deactivated

    const verifyActivation = await db.selectFrom("Credit_card").select("is_active").where("user_id", "=", decoded.id).executeTakeFirst();

    if (!verifyActivation) {
        return new Response(JSON.stringify({ error: 'Couldnt find a pin!' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (verifyActivation.is_active == 0) {
        return new Response(JSON.stringify({ error: 'Credit Card is not Active!' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // verifying user pin.
    const verifyPin = await db.selectFrom("Credit_card").select("pin_hash").where("user_id", "=", decoded.id).executeTakeFirst();

    if (!verifyPin) {
        return new Response(JSON.stringify({ error: 'Couldnt find a pin!' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const privateKey = fs.readFileSync(path.resolve("keys/private.pem"), 'utf-8');
    const decrypted = privateDecrypt(privateKey, Buffer.from(verifyPin?.pin_hash, 'base64'));
    const decryptedString = decrypted.toString();

    if (pin !== decryptedString) {
        return new Response(JSON.stringify({ error: 'Error Doesnt match!' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const TryDB = await db.selectFrom("Credit_card").select("user_id").where("card_number", "=", card_number).executeTakeFirst();
    const CurrentMoney = await db.selectFrom("Credit_card").select("balance").where("user_id", "=", decoded.id).executeTakeFirst();
    const MoneyConvert = Number(CurrentMoney?.balance);

    const UpdatedBalance = MoneyConvert - amount;
    const StrUpdatedBalance = UpdatedBalance.toString();
    if (!TryDB) {

        console.log("Money Sucessfully sended!")
        await db.updateTable("Credit_card").set({ balance: StrUpdatedBalance }).where("user_id", "=", decoded.id).executeTakeFirst();
        await db.insertInto("Transactions").values({
            sender_account_id: decoded.id, // sender's user ID
            receiver_account: card_number, // receiver's card number
            receiver_user_id: null, // We don't have this.
            description: message,
            reciever_name: username,
            category: category[0], // if category is an array, pick first one
            amount: amount.toString(),
            direction: "out",
            timestamp: new Date(), // or leave blank if the DB sets it automatically
        }).execute();
    } else {
        console.log(`DB je tohle: ${TryDB.user_id}`);

    }



    // Sucess Response.
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
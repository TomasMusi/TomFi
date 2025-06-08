import { DepositMoney, TokenSchema } from "$lib/zodtypes";
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

    // Checking Validation Zod.
    const DepositMoneyData = DepositMoney.safeParse(data);

    if (!DepositMoneyData.success) {
        return new Response(
            JSON.stringify({ error: 'Invalid data', issues: DepositMoneyData.error.flatten() }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Password
    const { token } = result.data;
    const decoded = verifyJWT(token);

    // Current money

    const CurrentMoneyVal = await db.selectFrom("Credit_card").select("balance").where("user_id", "=", decoded.id).executeTakeFirst();


    const CurrentMoneyValNum = Number(CurrentMoneyVal?.balance)

    const updatedBalance = CurrentMoneyValNum + data.money

    await db.updateTable("Credit_card").set({ balance: updatedBalance }).where("user_id", "=", decoded.id).execute();


    // Sucess Response.
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
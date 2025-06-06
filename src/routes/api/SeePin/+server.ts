import type { SeePinSchemaType } from "$lib/zodtypes";
import { SeePinSchema, TokenSchema } from "$lib/zodtypes";
import type { RequestHandler } from "@sveltejs/kit";
import { db } from "../../../types/db";
import bcrypt from 'bcrypt'
import * as fs from 'fs'
import path from "path";
import { privateDecrypt } from 'crypto';
import { parse } from 'cookie';
import { verifyJWT } from "../../../server/auth";

/*

1. Zod Validation
2. Get The Pin from Database, and i also need user id for it.
3. Check if the user entered right password [Bcrypt]
4. 

*/


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
    const PinResult = SeePinSchema.safeParse(data);

    if (!PinResult.success) {
        return new Response(
            JSON.stringify({ error: 'Invalid data', issues: PinResult.error.flatten() }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Password
    const { password }: SeePinSchemaType = PinResult.data;
    const { token } = result.data;
    const decoded = verifyJWT(token);
    // DB connection.


    const DB_PASSWORD = await db.selectFrom("Users").select("password").where("id", "=", decoded.id).executeTakeFirst();



    if (!DB_PASSWORD) {
        return new Response(JSON.stringify({ error: 'DB Error' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    // Bcrypt Hashing

    const BcryptChecking = bcrypt.compareSync(password, DB_PASSWORD.password);


    if (!BcryptChecking) {
        return new Response(JSON.stringify({ error: 'Password is not correct!' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }


    const getPin = await db.selectFrom("Credit_card").select("pin_hash").where("user_id", "=", decoded.id).executeTakeFirst();

    if (!getPin) {
        return new Response(JSON.stringify({ error: 'Couldnt find a pin!' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const privateKey = fs.readFileSync(path.resolve("keys/private.pem"), 'utf-8');

    const decrypted = privateDecrypt(privateKey, Buffer.from(getPin.pin_hash, 'base64'));
    console.log('Decrypted PIN:', decrypted.toString());
    const decryptedString = decrypted.toString();








    // Sucess Response.
    return new Response(JSON.stringify({ success: true, pin: decryptedString }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
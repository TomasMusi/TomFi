import { registerSchema, type registerSchemaType } from '$lib/zodtypes';
import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '../../../types/db';
import bcrypt from 'bcrypt'
import { BCRYPT_ROUNDS } from '$env/static/private';
import * as fs from 'fs'
import type { InsertResult } from 'kysely';
import { privateDecrypt, publicEncrypt } from 'crypto';
import path from 'path';


// Generating random Numbers
function generateFormattedNumber(): string {
    let result = '';
    for (let i = 0; i < 4; i++) {
        const group = Math.floor(1000 + Math.random() * 9000); // ensures 4 digits
        result += group.toString();
        if (i < 3) result += ' ';
    }
    return result;
}

function generateMultipleFormattedNumbers(count: number): string[] {
    const numbers: string[] = [];
    for (let i = 0; i < count; i++) {
        numbers.push(generateFormattedNumber());
    }
    return numbers;
}

// Example usage:
const numbers = generateMultipleFormattedNumbers(1);


const CheckCardNumber = await db.selectFrom("Credit_card").select("Credit_card.card_number").where("Credit_card.card_number", "=", numbers).execute();

if (CheckCardNumber.length > 0) {
    throw new Error('Credit card already exists');
}

// Generating PIN
function GeneratePin(count: number): string[] {
    const PIN: string[] = [];

    for (let i = 0; i < count; i++) {
        const saved = Math.floor(Math.random() * 9) + 1;
        PIN.push(saved.toString());
    }
    return PIN;
}

const PIN = GeneratePin(4).join('');

// convertnig adress of card to string
const numberstr = numbers.toString();

// Getting Keys

const privateKeys = fs.readFileSync(path.resolve('keys/private.pem'), 'utf-8');

const publicKey = fs.readFileSync(path.resolve("keys/public.pem"), 'utf-8');


// Encrypt PIN with public key  
const encrypted = publicEncrypt(publicKey, Buffer.from(PIN));
const encryptedBase64 = encrypted.toString('base64');
console.log(`Encrypted With Base 64 ${encryptedBase64}`);


const decrypted = privateDecrypt(privateKeys, Buffer.from(encryptedBase64, 'base64'));
console.log('Decrypted PIN:', decrypted.toString());



export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();

    const registerResult = registerSchema.safeParse(data);

    if (!registerResult.success) {
        return new Response(
            JSON.stringify({ error: 'Invalid data', issues: registerResult.error.flatten() }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Password, email, name
    const { password, email, name }: registerSchemaType = registerResult.data;

    // Checks if the email doesnt already exists.
    const checkingData = await db.selectFrom("Users").select("Users.id").where((eb) =>
        eb("Users.email", "=", email)).execute();

    if (checkingData.length > 0) {
        return new Response(JSON.stringify({ error: 'Already Exists' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const hash = bcrypt.hashSync(password, parseInt(BCRYPT_ROUNDS));


    const trx = await db.startTransaction().execute();

    try {
        const userResult = await trx.insertInto('Users').values({
            Name: name,
            password: hash,
            email: email,
            is_2fa_enabled: 0,
            role: "user",
            two_fa_secret: "0",
            created_at: new Date(),
            user_profile_picture: "/pfp/default.jpeg",
        }).executeTakeFirstOrThrow();

        let CreateCard = await trx.insertInto("Credit_card").values({
            balance: "1000",
            card_number: numberstr,
            user_id: Number(userResult.insertId),
            is_active: 1,
            pin_hash: encryptedBase64,
            created_at: new Date(),
        }).execute();
    }
    catch (err) {
        console.error(`chyba jest zde ${err}`);
    }




    // Sucess Response.
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
import { privateDecrypt, publicEncrypt } from "crypto";
import { db } from "../types/db";
import * as fs from 'fs'
import path from "path";


/* 

3. Insert it into DB with user_id!

*/


export async function CreateCreditCard(id: number) {


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


    // Generating 


    let CreateCard = await db.insertInto("Credit_card").values({
        balance: "1000",
        card_number: numberstr,
        user_id: id,
        is_active: 1,
        pin_hash: encryptedBase64,
        created_at: new Date(),
    }).execute();



    console.log(`numbers: ${numbers}`);
    console.log(`id ${id}`);

}
import { registerSchema, type registerSchemaType } from '$lib/zodtypes';
import { error, type RequestHandler } from '@sveltejs/kit';
import { db } from '../../../types/db';
import bcrypt from 'bcrypt'
import { BCRYPT_ROUNDS } from '$env/static/private';
import { CreateCreditCard } from '../../../server/createCard';



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

    const result = await db.insertInto("Users").values({
        Name: name,
        password: hash,
        email: email,
        is_2fa_enabled: 0,
        role: "user",
        two_fa_secret: "0",
        created_at: new Date(),
        user_profile_picture: "/pfp/default.jpeg",
    }).execute();


    const user = await db
        .selectFrom('Users')
        .select(['id']).where((eb) =>
            eb("Users.email", "=", email)).executeTakeFirst();

    if (user?.id == undefined) {
        throw error(301, "undefined");
    }

    const credit = await CreateCreditCard(user?.id);

    console.log(`User id ${user.id}`);
    console.log(`CreditCard: ${JSON.stringify(credit)}`);






    // Sucess Response.
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
import { loginSchema, type LoginSchemaType } from '$lib/zodtypes';
import { type RequestHandler } from '@sveltejs/kit';
import { db } from '../../../types/db';
import bcrypt from 'bcrypt'
import { signJWT } from '../../../server/auth';


export const POST: RequestHandler = async ({ request, cookies }) => {
    const data = await request.json();


    const parseResult = loginSchema.safeParse(data);

    if (!parseResult.success) {
        return new Response(
            JSON.stringify({ error: 'Invalid data', issues: parseResult.error.flatten() }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }



    const { email, password }: LoginSchemaType = parseResult.data;

    const CheckData = await db.selectFrom("Users").select("Users.id").where(eb => eb("Users.email", "=", email)).execute();

    if (CheckData.length <= 0) {
        return new Response(JSON.stringify({ error: 'Account Doesnt Exists' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const user = await db.selectFrom("Users").selectAll().where("Users.email", "=", email).execute();

    const compare = bcrypt.compareSync(password, user[0].password);

    if (!compare) {
        return new Response(JSON.stringify({ error: 'Password is not correct' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Creating token Calling a signJWT Function
    const token: string = signJWT({ id: user[0].id, email: email });

    cookies.set('token', token, {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7

    })

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
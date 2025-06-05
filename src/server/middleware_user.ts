import { parse } from 'cookie'
import { verifyJWT } from './auth'
import { redirect } from '@sveltejs/kit';
import type { JwtPayload } from 'jsonwebtoken';
import { TokenSchema } from '$lib/zodtypes';
import { db } from '../types/db';

// Export for function middlewareAuth to safe space, because it will be used many times.
export async function middlewareAuth(request: Request) {

    // requesting the cookie.
    const cookieHeader = request.headers.get('cookie') || '';
    // parsing the cookie
    const cookies = parse(cookieHeader)

    // validating cookies throw zod
    const result = TokenSchema.safeParse(cookies);

    // error handling
    if (!result.success) {
        throw redirect(302, '/');
    }

    // saving result data into variable token
    const { token } = result.data;

    // creating variable decoded, here because to be able to use it in try catch and return it.
    let decoded: string | JwtPayload | null = null;

    // error handling and verifying token.
    try {
        decoded = verifyJWT(token);

        const user = await db
            .selectFrom('Users')
            .select(['id', 'email', 'user_profile_picture', 'Name'])
            .where('id', '=', decoded.id)
            .executeTakeFirst();

        const card = await db
            .selectFrom("Credit_card")
            .select(['card_number', 'balance', 'pin_hash', 'is_active'])
            .where('user_id', '=', decoded.id)
            .executeTakeFirst();

        if (!user) {
            throw redirect(302, "/");
        }


        return {
            decoded,
            user,
            card
        };


    } catch (err) {
        throw redirect(302, '/');
    }
}
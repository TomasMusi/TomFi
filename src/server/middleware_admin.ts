import { parse } from 'cookie'
import { signJWT, verifyJWT } from './auth'
import { redirect } from '@sveltejs/kit';
import { TokenSchema } from '$lib/zodtypes';
import { db } from '../types/db';

// Export for function middlewareAuth to safe space, because it will be used many times.
export async function middlewareAuthAdmin(request: Request) {

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


    // error handling and verifying token.



    try {
        const decoded = verifyJWT(token);

        const user = await db
            .selectFrom('Users')
            .select(['id', 'email', 'role'])
            .where('id', '=', decoded.id)
            .executeTakeFirst();

        if (!user) {
            throw redirect(302, "/");
        }

        const isAdmin = user.role.trim() === "admin";


        if (!isAdmin) {
            throw redirect(302, "/");
        }

        return { decoded, user, isAdmin };

    } catch (err) {
        throw redirect(302, '/');
    }
}
import { TokenSchema } from '$lib/zodtypes';
import { parse } from 'cookie';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { verifyJWT } from '../server/auth';
import { db } from '../types/db';

export const load: PageServerLoad = async ({ request }) => {
    let logged = false;

    const cookieHeader = request.headers.get('cookie') || '';
    // parsing the cookie
    const cookies = parse(cookieHeader)

    // validating cookies throw zod
    const result = TokenSchema.safeParse(cookies);

    // error handling
    if (!result.success) {
        return { logged }
    }

    // saving result data into variable token
    const { token } = result.data;

    let decoded = null;


    try {
        decoded = verifyJWT(token);

        const user = await db
            .selectFrom('Users')
            .select(['id', 'email', 'user_profile_picture', 'Name'])
            .where('id', '=', decoded.id)
            .executeTakeFirst();

        if (!user) {
            throw redirect(302, "/");
        }

        logged = true;

        return {
            decoded,
            user,
            logged
        };


    } catch (err) {
        return {
            logged
        }
    }
};

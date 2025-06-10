import { middlewareAuth } from '../../../server/middleware_user';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ request }) => {
    try {
        const { decoded, user, card, transactions } = await middlewareAuth(request);
        return { user, decoded, card, transactions };
    } catch (err) {
        throw redirect(302, '/');
    }
};

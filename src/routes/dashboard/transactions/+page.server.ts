import { middlewareAuth } from '../../../server/middleware_user';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ request }) => {
    try {
        const { decoded, user } = await middlewareAuth(request);

        return { user, decoded };
    } catch (err) {
        throw redirect(302, '/');
    }
};

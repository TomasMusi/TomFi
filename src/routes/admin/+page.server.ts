import { middlewareAuthAdmin } from '../../server/middleware_admin'
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ request }) => {
    try {
        const user = await middlewareAuthAdmin(request);
        return { user };
    } catch (err) {
        throw redirect(302, '/');
    }
};

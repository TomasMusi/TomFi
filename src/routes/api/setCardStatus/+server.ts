import type { RequestHandler } from './$types';
import { verifyJWT } from '../../../server/auth';
import { db } from '../../../types/db';

export const GET: RequestHandler = async ({ cookies }) => {
    const data = cookies.get('token');

    if (!data) {
        return new Response(JSON.stringify({ error: 'Couldnt get cookie ' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // GET USER ID.
    const decoded = verifyJWT(data);

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
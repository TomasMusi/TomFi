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

    const setCardStatus = await db.selectFrom("Credit_card").select("is_active").where("user_id", "=", decoded.id).executeTakeFirst();

    if (setCardStatus?.is_active == 1) {
        await db
            .updateTable("Credit_card")
            .set({ is_active: 0 })
            .where("user_id", "=", decoded.id)
            .execute();
    } else {
        await db
            .updateTable("Credit_card")
            .set({ is_active: 1 })
            .where("user_id", "=", decoded.id)
            .execute();
    }

    return new Response(JSON.stringify({ success: true, }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
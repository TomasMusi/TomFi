import QRCode from 'qrcode';
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
    const getCreditData = await db.selectFrom("Credit_card").select("card_number").where("user_id", "=", decoded.id).executeTakeFirst();
    const getNameData = await db.selectFrom("Users").select("Name").where("id", "=", decoded.id).executeTakeFirst();

    if (!getCreditData || !getNameData) {
        return new Response(JSON.stringify({ error: 'Couldnt get data from Database ' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const finalData = getNameData?.Name + "-" + getCreditData?.card_number.split(' ').join('-');

    const qrDataURL = await QRCode.toDataURL(finalData);

    return new Response(JSON.stringify({ success: true, qrCode: qrDataURL }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
import { TokenSchema } from "$lib/zodtypes";
import type { RequestHandler } from "@sveltejs/kit";
import { db } from "../../../types/db";
import { parse } from 'cookie';
import { verifyJWT } from "../../../server/auth";
import speakeasyPkg from 'speakeasy';
const speakeasy = speakeasyPkg;

import QRCode from 'qrcode';

export const GET: RequestHandler = async ({ request }) => {
    const cookieHeader = request.headers.get('cookie') || '';
    // parsing the cookie
    const cookies = parse(cookieHeader)

    // validating cookies throw zod
    const result = TokenSchema.safeParse(cookies);

    // error handling
    if (!result.success) {
        return new Response(
            JSON.stringify({ error: 'Invalid data', issues: result.error.flatten() }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }


    // User ID.
    const { token } = result.data;
    const decoded = verifyJWT(token);

    const secret = speakeasy.generateSecret({
        name: `TomFi (${decoded.email})`
    });

    // this is temporary, only when is_2fa_enabled is equal to 1, it will be pernament!
    await db.updateTable("Users").set({ two_fa_secret: secret.base32 }).where("id", "=", decoded.id).executeTakeFirst();

    // generates QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Success
    return new Response(
        JSON.stringify({
            success: true,
            secret: secret.base32,
            qr: qrCodeUrl
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
}
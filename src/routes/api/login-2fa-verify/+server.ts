import { db } from "../../../types/db";
import type { RequestHandler } from "@sveltejs/kit";
import speakeasyPkg from 'speakeasy';
const speakeasy = speakeasyPkg;
import { signJWT } from "../../../server/auth";

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { userId, token } = await request.json();

    const user = await db.selectFrom("Users").selectAll().where("id", "=", userId).executeTakeFirst();

    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const verified = speakeasy.totp.verify({
        secret: user.two_fa_secret,
        encoding: 'base32',
        token
    });

    if (!verified) {
        return new Response(JSON.stringify({ error: "Invalid 2FA code" }), { status: 400 });
    }

    // Create JWT and set cookie
    const jwt = signJWT({ id: user.id, email: user.email });

    cookies.set('token', jwt, {
        path: "/",
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7
    });

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};

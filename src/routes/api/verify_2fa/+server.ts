import type { RequestHandler } from "@sveltejs/kit";
import { parse } from "cookie";
import { TokenSchema } from "$lib/zodtypes";
import { verifyJWT } from "../../../server/auth";
import { db } from "../../../types/db";
import speakeasyPkg from "speakeasy";

const speakeasy = speakeasyPkg;

export const POST: RequestHandler = async ({ request }) => {
    const cookies = parse(request.headers.get("cookie") || "");
    const parsed = TokenSchema.safeParse(cookies);

    if (!parsed.success) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    const { token } = parsed.data;
    const decoded = verifyJWT(token);
    if (!decoded?.id) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 403
        });
    }

    const body = await request.json();
    const { token: userCode } = body;

    const user = await db
        .selectFrom("Users")
        .select(["two_fa_secret"])
        .where("id", "=", decoded.id)
        .executeTakeFirst();

    if (!user || !user.two_fa_secret) {
        return new Response(JSON.stringify({ error: "2FA not initialized" }), {
            status: 400
        });
    }

    const verified = speakeasy.totp.verify({
        secret: user.two_fa_secret,
        encoding: "base32",
        token: userCode,
        window: 1 // allow +/- 30s
    });

    if (!verified) {
        return new Response(JSON.stringify({ success: false }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Optionally mark 2FA as verified in DB if you're tracking setup progress
    await db
        .updateTable("Users")
        .set({ is_2fa_enabled: 1 }) // optional: track verification status
        .where("id", "=", decoded.id)
        .execute();

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
};


import { type RequestHandler } from '@sveltejs/kit';
import { db } from '../../../types/db';
import { format } from 'date-fns';
import { unlink, writeFile } from 'fs/promises';
import path from 'path';
import { parse } from 'cookie'
import { TokenSchema } from '$lib/zodtypes';
import { verifyJWT } from '../../../server/auth';

const MAX_IMAGE_SIZE: number = 5 * 1024 * 1024;
const ALLOWED_TYPES: string[] = ['image/png', 'image/jpg', 'image/webp', 'image/jpeg'];

export const POST: RequestHandler = async ({ request }) => {
    // requesting the cookie.
    const cookieHeader = request.headers.get('cookie') || '';
    // parsing the cookie
    const cookies = parse(cookieHeader)
    // validating cookies throw zod
    const result = TokenSchema.safeParse(cookies);

    // error handling
    if (!result.success) {
        return new Response(JSON.stringify({ error: 'Invalid or missing token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // saving result data into variable token
    const { token } = result.data;
    const decoded = verifyJWT(token);
    const formData = await request.formData();
    const image = formData.get("image") as File | null

    if (!image) {
        return new Response(
            JSON.stringify({ message: 'Invalid missing image' }),
            { status: 400 }
        );
    }

    if (image.size >= MAX_IMAGE_SIZE) {
        return new Response(
            JSON.stringify({ error: 'File is too big. Max 5mb' }),
            { status: 400 }
        );
    }

    if (!ALLOWED_TYPES.includes(image.type)) {
        return new Response(
            JSON.stringify({ error: 'File doesnt have right formate' }),
            { status: 400 }
        );
    }

    const CurrectUserImage = await db.selectFrom('Users')
        .select(['user_profile_picture'])
        .where('id', '=', decoded.id)
        .executeTakeFirst();

    if (!CurrectUserImage) {
        return new Response(
            JSON.stringify({ error: 'Account wasnt founded.' }),
            { status: 400 }
        );
    }

    const CheckedPath = CurrectUserImage.user_profile_picture;

    if (CheckedPath !== "static/pfp/default.jpeg") {
        await unlink(`static/${CheckedPath}`);
    }

    // Date for saving picture with timer.
    const now = new Date();
    // formate (special library that gives you time formatted)
    const formattedDate = format(now, 'yyyy-MM-dd_HH-mm');

    const Imagemime = image.type;
    const ImageFirstName = image.name;
    const imageCut = ImageFirstName.split(".")[0];
    const ext = Imagemime.split("/")[1];
    const ImageName = imageCut + "-" + formattedDate + "." + ext;
    const buffer = Buffer.from(await image.arrayBuffer());
    const filepath = path.resolve("static/pfp", ImageName)

    writeFile(filepath, buffer);

    const imageUrl = `/pfp/${ImageName}`

    const user = await db.updateTable('Users').set({ user_profile_picture: imageUrl }).where("id", "=", decoded.id).execute();

    if (!user) {
        return new Response(
            JSON.stringify({ error: 'Account wasnt founded.' }),
            { status: 400 }
        );
    }

    // Sucess Response.
    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
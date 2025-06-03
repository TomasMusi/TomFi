import { JWT_KEY } from "$env/static/private";
import jwt from "jsonwebtoken";

export function signJWT(payload: object): string {
    return jwt.sign(payload, JWT_KEY, { expiresIn: "2h" })
}
// Function verifyJWT
export function verifyJWT(token: string): string | jwt.JwtPayload | null {
    // try, catch,
    try {
        return jwt.verify(token, JWT_KEY);
    } catch (err) {
        throw err;
    }
}
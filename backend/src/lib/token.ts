import token from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET_KEY: secret } = process.env;

type TokenPayloadType = {
    _id: string;
    name: string;
};

export type DecodedTokenType = {
    _id: string;
    name: string;
    iat: number;
    exp: number;
};

export const generateToken = async ({
    _id,
    name,
}: TokenPayloadType): Promise<string> => {
    return new Promise((resolve, reject) => {
        token.sign(
            { _id, name },
            secret as string,
            {
                expiresIn: '7d',
            },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
};

export const decodeToken = (jwtToken: string): Promise<DecodedTokenType> => {
    return new Promise((resolve, reject) => {
        token.verify(
            jwtToken,
            secret as string,
            undefined,
            (err, decoded: any) => {
                if (err) reject(err);
                resolve(decoded);
            }
        );
    });
};

// export const jwtMiddleware = async (req: Request, res: Response, next: any) => {
//     const token = req.cookies['token'];
//     if (!token) return next();

//     try {
//         const decoded: DecodedTokenType = await decodeToken(token);
//         if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
//             const { _id, name } = decoded;
//             const freshToken = await generateToken({ _id, name });
//             res.cookie('token', freshToken, {
//                 maxAge: 1000 * 60 * 60 * 24 * 7,
//                 httpOnly: true,
//             });
//         }
//     } catch (e) {
//         res.cookie('token', null);
//     }
//     return next();
// };

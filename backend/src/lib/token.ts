import token from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET_KEY: secret } = process.env;

type TokenPayloadType = {
    _id: string;
    name: string;
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

export const decodeToken = (jwtToken: string): Promise<object | string> => {
    return new Promise((resolve, reject) => {
        token.verify(jwtToken, secret as string, undefined, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    });
};

export const jwtMiddleware = async (ctx, next) => {
    try {
    } catch (e) {
        ctx.request.user = null;
    }
};

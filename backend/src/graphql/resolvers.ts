import Memo from '../models/Memo';
import User from '../models/User';
import mongoose from 'mongoose';
import joi from 'joi';
import { generateToken, decodeToken } from 'lib/token';

type FindByIdPayload = {
    _id: mongoose.Types.ObjectId;
};

type CreateMemoPayload = {
    content: string;
    writer: string;
    createdAt: string;
};

type UpdateMemoPayload = {
    _id: mongoose.Types.ObjectId;
    content: string;
};

type CreateUserPayload = {
    name: string;
    password: string;
};

type FindUserPayload = {
    name: string;
    password: string;
};

type TokenType = {
    token: string;
};

const resolvers = {
    Query: {
        memos: async () => {
            try {
                const memos = await Memo.find();
                return memos;
            } catch (e) {
                console.log(e);
            }
        },
        memo: async (_: any, { _id }: FindByIdPayload) => {
            try {
                const memo = await Memo.findById(_id);
                return memo;
            } catch (e) {
                console.log(e);
            }
        },
        user: async (_: any, { _id }: FindByIdPayload) => {
            try {
                const user = await User.findById(_id);
                return user;
            } catch (e) {
                console.log(e);
            }
        },
        checkUserLoggedIn: async (_: any, { token }: TokenType) => {
            try {
                const decoded = await decodeToken(token);
                const user = await User.findById((decoded as any)._id);
                if (!user) {
                    return null;
                }
                return user;
            } catch (e) {
                console.log('error', e);
                return null;
            }
        },
    },
    Mutation: {
        createMemo: async (
            _: any,
            { content, writer, createdAt }: CreateMemoPayload
        ): Promise<any> => {
            try {
                const memo = new Memo({
                    content,
                    writer,
                    createdAt,
                });
                await memo.save();
                return memo;
            } catch (e) {
                console.log(e);
            }
        },
        updateMemo: async (
            _: any,
            { _id, content }: UpdateMemoPayload
        ): Promise<any> => {
            try {
                const memo = await Memo.findByIdAndUpdate(
                    _id,
                    {
                        content,
                    },
                    {
                        new: true,
                    }
                );
                return memo;
            } catch (e) {
                console.log(e);
            }
        },
        createUser: async (_: any, { name, password }: CreateUserPayload) => {
            // validate name, password
            const schema = joi.object().keys({
                name: joi
                    .string()
                    .required()
                    .min(8)
                    .max(20)
                    .alphanum(),
                password: joi
                    .string()
                    .required()
                    .min(6)
                    .max(30),
            });

            const result = joi.validate(
                {
                    name,
                    password,
                },
                schema
            );

            if (result.error) {
                return {
                    _id: null,
                    name: null,
                    jwt: '',
                    error: 400,
                };
            }

            try {
                const existing = await (User as any).checkExisting(name);
                if (existing) {
                    return {
                        _id: null,
                        name: null,
                        jwt: '',
                        error: 409,
                    };
                }

                const hashed = (User as any).hashPassword(password);
                const user = new User({
                    name,
                    password: hashed,
                });

                await user.save();

                const token = await generateToken({
                    _id: user._id,
                    name: (user as any).name,
                });

                return {
                    _id: user._id,
                    name: (user as any).name,
                    jwt: token,
                    error: null,
                };
            } catch (e) {
                console.log(e);
            }
        },
        findUserByNameAndPassword: async (
            _: any,
            { name, password }: FindUserPayload
        ) => {
            try {
                const user = await (User as any).checkExisting(name);

                if (!user) {
                    return {
                        error: 404,
                    };
                }
                const hashedPassword = (User as any).hashPassword(password);
                const passwordCheck = user.checkPassword(hashedPassword);

                if (!passwordCheck) {
                    return {
                        error: 401,
                    };
                }

                const token = await generateToken({
                    _id: user._id,
                    name: user.name,
                });

                return {
                    _id: user._id,
                    name: user.name,
                    jwt: token,
                    error: null,
                };
            } catch (e) {
                console.log(e);
            }
        },
    },
};

export default resolvers;

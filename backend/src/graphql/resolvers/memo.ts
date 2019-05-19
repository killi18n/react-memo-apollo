import Memo from 'models/Memo';
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

type GetMemosPayload = {
    page: number;
    limit: number;
};

const resolver = {
    Query: {
        memos: async (_: any, { page, limit }: GetMemosPayload) => {
            try {
                const memos = await Memo.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean()
                    .exec();

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
    },
    Mutation: {
        createMemo: async (
            _: any,
            { content, createdAt }: CreateMemoPayload,
            context: any
        ): Promise<any> => {
            if (!context.decodedToken) {
                return {
                    memo: null,
                    error: 401,
                };
            }

            const { name } = context.decodedToken;

            try {
                const memo = new Memo({
                    content,
                    writer: name,
                    createdAt,
                });
                await memo.save();
                return {
                    memo,
                    error: null,
                };
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
    },
};

export default resolver;

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

const resolver = {
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
    },
};

export default resolver;

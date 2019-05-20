import { PubSub } from 'apollo-server';
import mongoose from 'mongoose';
import Memo from 'models/Memo';

const pubSub = new PubSub();
const MEMO_CREATED = 'MEMO_CREATED';

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
                    .sort({ _id: -1 })
                    .exec();

                const count = await Memo.count({}).exec();
                const lastPage = Math.ceil(count / limit);

                return {
                    memos,
                    lastPage,
                };
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
            console.log(context.decodedToken);
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
                pubSub.publish(MEMO_CREATED, {
                    memoCreated: {
                        _id: memo._id,
                        content: (memo as any).content,
                        writer: (memo as any).writer,
                        updatedAt: (memo as any).updatedAt,
                        createdAt: (memo as any).createdAt,
                        isSubscribed: true,
                    },
                });
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
    Subscription: {
        memoCreated: {
            subscribe: () => pubSub.asyncIterator([MEMO_CREATED]),
        },
    },
};

export default resolver;

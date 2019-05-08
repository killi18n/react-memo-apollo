import Memo from '../models/Memo';
import User from '../models/User';
import mongoose from 'mongoose';

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

type CheckUserPayload = {
    name: string;
    password: string;
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
            try {
                const existing = await (User as any).checkExisting(name);
                if (existing) {
                    return;
                }

                const hashed = (User as any).hashPassword(password);
                const user = new User({
                    name,
                    password: hashed,
                });
                await user.save();
                return user;
            } catch (e) {
                console.log(e);
            }
        },
        checkUser: async (_: any, { name, password }: CheckUserPayload) => {
            try {
                const isExisting = await (User as any).checkExisting(name);
                if (!isExisting) {
                    return null;
                }
                const passwordCheck = isExisting.checkPassword(password);
                if (!passwordCheck) {
                    return null;
                }
                return isExisting;
            } catch (e) {
                console.log(e);
            }
        },
    },
};

export default resolvers;

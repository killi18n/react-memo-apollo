import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const { HASH_PASSWORD_KEY: hashKey } = process.env;

type User = {
    hashPassword(password: string): string;
};

const User = new mongoose.Schema({
    name: String,
    password: String,
    createdAt: {
        default: new Date(),
        type: Date,
    },
});

User.statics.hashPassword = (password: string): string => {
    const hashed = crypto
        .createHmac('sha256', hashKey as string)
        .update(password)
        .digest('base64');
    return hashed;
};

User.statics.checkExisting = async function(name: string): Promise<any> {
    try {
        const existing = await this.findOne({ name }).exec();
        return existing;
    } catch (e) {
        console.log(e);
    }
};

User.methods.checkPassword = function(password: string): boolean {
    return this.password === password;
};

export default mongoose.model('User', User);

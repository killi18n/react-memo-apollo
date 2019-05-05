import mongoose from 'mongoose';

const Memo = new mongoose.Schema({
    content: String,
    writer: String,
    createdAt: String,
    updatedAt: {
        default: '',
        type: String,
    },
});

export default mongoose.model('Memo', Memo);

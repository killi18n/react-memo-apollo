"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Memo = new mongoose_1.default.Schema({
    content: String,
    writer: String,
    createdAt: String,
    updatedAt: {
        default: '',
        type: String,
    },
});
exports.default = mongoose_1.default.model('Memo', Memo);
//# sourceMappingURL=Memo.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    blog: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Blog",
    },
});
const Comment = (0, mongoose_1.model)("Comment", commentSchema);
exports.default = Comment;
//# sourceMappingURL=Comment.js.map
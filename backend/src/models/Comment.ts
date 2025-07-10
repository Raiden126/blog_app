import { model, Schema } from "mongoose";

const commentSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  blog: {
    type: Schema.Types.ObjectId,
    ref: "Blog",
  },
});

const Comment = model("Comment", commentSchema);
export default Comment;

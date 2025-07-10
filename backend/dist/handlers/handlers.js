"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const schema_1 = require("../schema/schema");
const User_1 = __importDefault(require("../models/User"));
const Blog_1 = __importDefault(require("../models/Blog"));
const Comment_1 = __importDefault(require("../models/Comment"));
const mongoose_1 = require("mongoose");
const bcryptjs_1 = require("bcryptjs");
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQuery",
    fields: {
        //get all users
        users: {
            type: (0, graphql_1.GraphQLList)(schema_1.UserType),
            async resolve() {
                return await User_1.default.find();
            },
        },
        //get all blogs
        blogs: {
            type: (0, graphql_1.GraphQLList)(schema_1.BlogType),
            async resolve() {
                return await Blog_1.default.find();
            },
        },
        // get all comments
        comments: {
            type: (0, graphql_1.GraphQLList)(schema_1.CommentType),
            async resolve() {
                return await Comment_1.default.find();
            },
        },
    },
});
const Mutation = new graphql_1.GraphQLObjectType({
    name: "Mutation",
    fields: {
        //creating a new user
        signup: {
            type: schema_1.UserType,
            args: {
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(parent, { name, email, password }) {
                let existingUser;
                try {
                    existingUser = await User_1.default.findOne({ email });
                    if (existingUser) {
                        throw new Error("User already exists with this email");
                    }
                    const encryptedPassword = (0, bcryptjs_1.hashSync)(password);
                    const user = new User_1.default({
                        name,
                        email,
                        password: encryptedPassword,
                    });
                    return await user.save();
                }
                catch (error) {
                    console.error("Error during user signup:", error);
                    return new Error("User Signup Failed, Try Again");
                }
            },
        },
        login: {
            type: schema_1.UserType,
            args: {
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                password: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(parent, { email, password }) {
                let existingUser;
                try {
                    existingUser = await User_1.default.findOne({ email });
                    if (!existingUser) {
                        throw new Error("User with email does not exit");
                    }
                    const decryptedPassword = (0, bcryptjs_1.compareSync)(password, 
                    //@ts-ignore
                    existingUser?.password);
                    if (!decryptedPassword)
                        throw new Error("Incorrect Password");
                    return existingUser;
                }
                catch (error) {
                    console.log('Login Failed', error);
                    return new Error(error);
                }
            },
        },
        //create blog
        addBlog: {
            type: schema_1.BlogType,
            args: {
                title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                date: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                user: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) }
            },
            async resolve(parent, { title, content, date, user }) {
                let blog;
                const session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction({ session });
                    blog = new Blog_1.default({
                        title,
                        content,
                        date,
                        user
                    });
                    const existingUser = await User_1.default.findById(user);
                    if (!existingUser)
                        return new Error("User not found! Exiting");
                    existingUser.blogs.push(blog);
                    await existingUser.save({ session });
                    return await blog.save({ session });
                }
                catch (error) {
                    throw new Error(error);
                }
                finally {
                    await session.commitTransaction();
                }
            }
        },
        //update blog
        updateBlog: {
            type: schema_1.BlogType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                title: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                content: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            async resolve(parent, { id, title, content }) {
                let existingBlog;
                try {
                    existingBlog = await Blog_1.default.findById(id);
                    if (!existingBlog)
                        return new Error("Blog does not exist");
                    return await Blog_1.default.findByIdAndUpdate(id, {
                        title,
                        content
                    }, { new: true });
                }
                catch (error) {
                    return new Error(error);
                }
            }
        },
        // delete blog
        deleteBlog: {
            type: schema_1.BlogType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) }
            },
            async resolve(parent, { id }) {
                let existingBlog;
                const session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction({ session });
                    existingBlog = await Blog_1.default.findById(id).populate("user");
                    //@ts-ignore
                    const existingUser = existingBlog.user;
                    if (!existingUser)
                        return new Error("No user linked with that blog");
                    if (!existingBlog)
                        return new Error("Blog does not exist");
                    existingUser.blogs.pull(existingBlog);
                    await existingUser.save({ session });
                    return await existingBlog.deleteOne({ id: existingBlog.id });
                }
                catch (error) {
                    throw new Error(error);
                }
                finally {
                    session.commitTransaction();
                }
            }
        },
        //add comment
        addCommentToBlog: {
            type: schema_1.CommentType,
            args: {
                text: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                date: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                blog: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
                user: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) }
            },
            async resolve(parent, { text, date, blog, user }) {
                const session = await (0, mongoose_1.startSession)();
                let comment;
                try {
                    session.startTransaction({ session });
                    const existingUser = await User_1.default.findById(user);
                    const existingBlog = await Blog_1.default.findById(blog);
                    if (!existingBlog || !existingBlog)
                        return new Error("User or Blog does not exist");
                    comment = new Comment_1.default({
                        text,
                        date,
                        blog,
                        user
                    });
                    //@ts-ignore
                    existingUser.comments.push(comment);
                    //@ts-ignore
                    existingBlog.comments.push(comment);
                    await existingBlog.save({ session });
                    await existingUser.save({ session });
                    return await comment.save({ session });
                }
                catch (error) {
                    return new Error(error);
                }
                finally {
                    await session.commitTransaction();
                }
            }
        },
        //delete a comment from blog
        deleteComment: {
            type: schema_1.CommentType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) }
            },
            async resolve(parent, { id }) {
                let comment;
                let session = await (0, mongoose_1.startSession)();
                try {
                    session.startTransaction({ session });
                    comment = await Comment_1.default.findById(id);
                    if (!comment)
                        return new Error('Comment does not exist');
                    //@ts-ignore
                    const existingUser = await User_1.default.findById(comment?.user);
                    if (!existingUser)
                        return new Error("User not found");
                    //@ts-ignore
                    const existingBlog = await Blog_1.default.findById(comment?.blog);
                    if (!existingBlog)
                        return new Error("Blog not found");
                    //@ts-ignore
                    existingUser.comments.pull(comment);
                    //@ts-ignore
                    existingBlog.comments.pull(comment);
                    await existingUser.save({ session });
                    await existingBlog.save({ session });
                    return await comment.deleteOne({ id: comment.id });
                }
                catch (error) {
                    return new Error(error);
                }
                finally {
                    await session.commitTransaction();
                }
            }
        }
    },
});
exports.default = new graphql_1.GraphQLSchema({ query: RootQuery, mutation: Mutation });
//# sourceMappingURL=handlers.js.map
import {
    GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { BlogType, CommentType, UserType } from "../schema/schema";
import User from "../models/User";
import Blog from "../models/Blog";
import Comment from "../models/Comment";
import { Document, startSession } from "mongoose";
import { compareSync, hashSync } from "bcryptjs";

type DocumentType = Document <any,any,any>

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    //get all users
    users: {
      type: GraphQLList(UserType),
      async resolve() {
        return await User.find();
      },
    },

    //get all blogs
    blogs: {
      type: GraphQLList(BlogType),
      async resolve() {
        return await Blog.find();
      },
    },

    // get all comments
    comments: {
      type: GraphQLList(CommentType),
      async resolve() {
        return await Comment.find();
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    //creating a new user
    signup: {
      type: UserType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { name, email, password }) {
        let existingUser: DocumentType;
        try {
          existingUser = await User.findOne({ email });
          if (existingUser) {
            throw new Error("User already exists with this email");
          }
          const encryptedPassword = hashSync(password);
          const user = new User({
            name,
            email,
            password: encryptedPassword,
          });

          return await user.save();
        } catch (error) {
          console.error("Error during user signup:", error);
          return new Error("User Signup Failed, Try Again");
        }
      },
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { email, password }) {
        let existingUser: DocumentType;
        try {
          existingUser = await User.findOne({ email });
          if (!existingUser) {
            throw new Error("User with email does not exit");
          }
          const decryptedPassword = compareSync(
            password,
            //@ts-ignore
            existingUser?.password
          );
          if(!decryptedPassword) throw new Error("Incorrect Password");
          return existingUser;
        } catch (error) {
            console.log('Login Failed', error);
            return new Error(error);
        }
      },
    },
    //create blog
    addBlog: {
        type: BlogType,
        args: {
            title: {type: GraphQLNonNull(GraphQLString)},
            content: {type: GraphQLNonNull(GraphQLString)},
            date: {type: GraphQLNonNull(GraphQLString)},
            user: {type: GraphQLNonNull(GraphQLID)}
        },
        async resolve (parent, {title, content, date, user}){
            let blog: DocumentType;
            const session = await startSession();

            try {
                session.startTransaction({session});
                blog = new Blog({
                    title,
                    content,
                    date,
                    user
                })
                const existingUser: any = await User.findById(user);
                if(!existingUser) return new Error("User not found! Exiting");
                existingUser.blogs.push(blog);
                await existingUser.save({session});
                return await blog.save({session});
            } catch (error) {
                throw new Error(error);
            } finally {
                await session.commitTransaction();
            }
        }
    },

    //update blog
    updateBlog: {
        type: BlogType,
        args: {
            id: {type: GraphQLNonNull(GraphQLString)},
            title: {type: GraphQLNonNull(GraphQLString)},
            content: {type: GraphQLNonNull(GraphQLString)},
        },
        async resolve (parent, {id, title, content}) {
            let existingBlog: DocumentType;
            try {
                existingBlog = await Blog.findById(id);
                if(!existingBlog) return new Error("Blog does not exist");
                return await Blog.findByIdAndUpdate(id, {
                    title,
                    content
                },{new: true})
            } catch (error) {
                return new Error(error);
            }
        }
    },

    // delete blog
    deleteBlog: {
        type: BlogType,
        args: {
            id: {type: GraphQLNonNull(GraphQLString)}
        },
        async resolve (parent, {id}) {
            let existingBlog: DocumentType;
            const session = await startSession();
            try {
                session.startTransaction({session});
                existingBlog = await Blog.findById(id).populate("user");
                //@ts-ignore
                const existingUser = existingBlog.user;
                if(!existingUser) return new Error("No user linked with that blog");
                if(!existingBlog) return new Error("Blog does not exist");
                existingUser.blogs.pull(existingBlog);
                await existingUser.save({session});
                return await existingBlog.deleteOne({id: existingBlog.id});
            } catch (error) {
                throw new Error(error)
            } finally {
                session.commitTransaction();
            }
        }
    },

    //add comment
    addCommentToBlog: {
        type: CommentType,
        args: {
            text: {type: GraphQLNonNull(GraphQLString)},
            date: {type: GraphQLNonNull(GraphQLString)},
            blog: {type: GraphQLNonNull(GraphQLID)},
            user: {type: GraphQLNonNull(GraphQLID)}
        },
        async resolve(parent, {text, date, blog, user}) {
            const session = await startSession();
            let comment: DocumentType;
            try {
                session.startTransaction({session});
                const existingUser = await User.findById(user);
                const existingBlog = await Blog.findById(blog);
                if(!existingBlog || !existingBlog) return new Error("User or Blog does not exist");
                comment = new Comment({
                    text,
                    date,
                    blog,
                    user
                });
                //@ts-ignore
                existingUser.comments.push(comment);
                //@ts-ignore
                existingBlog.comments.push(comment);
                await existingBlog.save({session});
                await existingUser.save({session});
                return await comment.save({session});
            } catch (error) {
                return new Error(error);
            } finally {
                await session.commitTransaction();
            }
        }
    },

    //delete a comment from blog
    deleteComment: {
        type: CommentType,
        args: {
            id: {type: GraphQLNonNull(GraphQLID)}
        },
        async resolve(parent , {id}) {
            let comment: DocumentType;
            let session = await startSession();
            try {
                session.startTransaction({session});
                comment = await Comment.findById(id);
                if(!comment) return new Error('Comment does not exist');
                //@ts-ignore
                const existingUser = await User.findById(comment?.user);
                if(!existingUser) return new Error("User not found");
                //@ts-ignore
                const existingBlog = await Blog.findById(comment?.blog);
                if(!existingBlog) return new Error("Blog not found");
                //@ts-ignore
                existingUser.comments.pull(comment);
                //@ts-ignore
                existingBlog.comments.pull(comment);

                await existingUser.save({session});
                await existingBlog.save({session});
                return await comment.deleteOne({id: comment.id});
            } catch (error) {
                return new Error(error);
            } finally {
                await session.commitTransaction();
            }
        }
    }
  },
});

export default new GraphQLSchema({ query: RootQuery, mutation: Mutation });

import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./utils/connection";
import { graphqlHTTP } from "express-graphql";
import schema from './handlers/handlers';

dotenv.config();

const app = express();

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  });

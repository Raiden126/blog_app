import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./utils/connection";
import { graphqlHTTP } from "express-graphql";
import schema from "./handlers/handlers";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use("/graphql", function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', "true");
  res.header('Access-Control-Allow-Headers', 'content-type, authorization, content-length, x-requested-with, accept, origin');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.header('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use("/graphql",cors(), graphqlHTTP({
  schema,
  graphiql: true,
}));

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

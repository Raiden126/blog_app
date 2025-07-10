"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = require("./utils/connection");
const express_graphql_1 = require("express-graphql");
const handlers_1 = __importDefault(require("./handlers/handlers"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use('/graphql', (0, express_graphql_1.graphqlHTTP)({ schema: handlers_1.default, graphiql: true }));
const PORT = process.env.PORT || 5000;
(0, connection_1.connectToDatabase)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});
//# sourceMappingURL=app.js.map
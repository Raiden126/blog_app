"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = require("mongoose");
const connectToDatabase = async () => {
    try {
        await (0, mongoose_1.connect)(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=connection.js.map
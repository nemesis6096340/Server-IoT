/**
 * Reading Environment Variables
 */
import { config } from "dotenv";
config();

export default {
    db: {
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
    },
    dbs: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME_SESSION,
    },
    port: process.env.PORT || 4000,

    captcha:{
        public: process.env.V3_PUBLIC,
        private: process.env.V3_PRIVATE
    }
};
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    charset: process.env.MYSQL_CHARSET,
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_MAX_OPEN_CONNS) || 500,
    maxIdle: Number(process.env.MYSQL_MAX_IDLE_CONNS) || 50,
});

export const db = drizzle(pool);

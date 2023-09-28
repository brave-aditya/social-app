import mysql from "mysql2"
import * as dotenv from 'dotenv'
dotenv.config()

export const db = mysql.createConnection({
   host: process.env.HOST,
   port: 4000,
   user: process.env.USER,
   password: process.env.PASSWORD,
   database: process.env.DATABASE,
   ssl: {
     minVersion: 'TLSv1.2',
     rejectUnauthorized: true
   }
 });
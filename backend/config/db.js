import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();
const {PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT} = process.env;

// creates sql connection useing env  variables
export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?sslmode=require&channel_binding=require`
    // psql 'postgresql://neondb_owner:npg_j9RhlV7LnHfP@ep-solitary-bush-a8rr0nq0-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
)

// this sql function we export is used as a tagged literal, 
// which allows us to write SQL queries safely
// const express = reuire("express");

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // if PORT is not defined in the .env file, we will use 3000 as the default port

const __dirname = path.resolve();

console.log(PORT);


app.use(express.json()); // to parse the json data from the request body
app.use(cors()); // to prevent any course errors

app.use(helmet({
    contentSecurityPolicy:false,
}));  // security, secured from hackers
app.use(morgan("dev")); // log the requests in the console, for debugging purposes
// app.get("/", (req, res) => {
//     console.log(res.getHeaders());
//     res.send("Hello from backend!");
// })
// if we send a get request to /, we send "Hello from backend!" as a response

// we wd do this is not usng API
// but sice we are, this is hardcoded, wont use, 
// jus ex. to understand ki data aise hoga as list
// app.get("/api/products", (req, res) => {
//     // gte all results from the DB
//     res.status(200).json({
//         success: true,
//         data: [
//             {id:1, name:"p1"},
//             {id:2, name:"p2"},
//             {id:3, name:"p3"},
//         ],
//     });
// });


// apply arcjet rate-limit to all routes
app.use(async(req,res,next) => {
    try{
        const decision = await aj.protect(req, { 
            requested:1 //specifies that each request comsumes 1 token
        })

        if (decision.isDenied()){
            if (decision.reason.isRateLimit())
            {
                res.status(429).json({error:"Too many Req"});
            }
            else if (decision.reason.isBot())
            {
                 res.status(403).json({error:"Bot access denied"});
            }
            else
            {
                res.status(403).json({error:"Forbidden"});
            }
            return
        }
        //checl for spoofed bots (when bot ied to act no like a bot)
        next();
    }
    catch (error)
    {
        console.log("Arcjet error", error);
        next(error);
    }
})


// we will use the product route for all the product related route
app.use("/api/products", productRoutes);

if(process.env.NODE_ENV==="production")
{
    // serve our react appl
    const distPath = path.join(__dirname, "frontend", "dist");
    app.use(express.static(distPath));
    app.get(".all", (req,res)=> {
        res.sendFile(path.resolve(distPath,"index.html"));
    })
}



async function initDB()
{
    try 
    {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `; 
        // ) for (), ; for sql wuery end, ` for tagged literal, ; for a line in code ending 
        console.log("Database initialized");
    }
    catch (error)
    {
        console.error("Error initializing database:", error);
    }
}



initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    });
});
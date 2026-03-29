import { app } from "./app.js";
import dns from "dns";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db/index.js";
const port = process.env.PORT || 3000;
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const startServer= async()=>{
    try {
        await connectDB();
        app.listen(port,()=>{
        console.log("Connected to server");
        }
    )
    } catch (error) {
        console.log(error.message);
        console.log("error in sending request ");
    }
}
startServer();

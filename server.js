import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import pool from './config/db.js'
import blogRoutes from './routes/blogRoutes.js'
import adminRoutes from "./routes/adminRoutes.js"
import createTables from './config/initDB.js'


dotenv.config();
const app = express()
app.use(express.json()); 
app.use(cors())
app.use(bodyParser.json())



createTables().then(() => {
    console.log("Database Initialization Complete ✅");
}).catch(err => {
    console.error("Database Initialization Failed ❌", err);
});


app.get("/", (req, res) => {
    return res.json({ message: "Hello, World!" })
})

app.use('/api', blogRoutes);
app.use('/api/admin', adminRoutes);

async function databaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("DATABASE CONNECTED SUCCESSFULLY");
        connection.release();  // important to release the connection back to the pool
    } catch (error) {
        console.error("DATABASE CONNECTION FAILED:", error.message);
    }
}

databaseConnection()

app.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`);

})
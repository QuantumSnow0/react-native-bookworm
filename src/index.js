import express from "express"
import authRoutes from "./routes/authRoutes.js"
import bookRoutes from "./routes/bookRoutes.js"
import cors from "cors"
import job from "./lib/cron.js"
import "dotenv/config"
import { connectDB } from "./lib/db.js"
const app = express()
const PORT = process.env.PORT || 3000
job.start()
app.use(express.json())
app.use(cors())
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

app.listen(PORT, "0.0.0.0" ,  () => {
    console.log(`listening to http://192.168.201.31:${PORT}`); 
    connectDB();
})
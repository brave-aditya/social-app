import express from "express";
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import commentRoutes from './routes/comments.js'
import likeRoutes from './routes/likes.js'
import relationshipRoutes from './routes/relationships.js'
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./connect.js";
const app = express();
const PORT = process.env.port||8808;

//middlewares
app.use(express.json())
app.use(cors())

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql database!");
});

app.use("/api/auth", authRoutes);
app.use("/api/users",  userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);

app.listen(PORT,()=>{
    console.log(`Api working fine on port:${PORT}`);
});
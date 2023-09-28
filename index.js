import express from "express";
import userRoutes from './routes/users.js'
import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'
import commentRoutes from './routes/comments.js'
import likeRoutes from './routes/likes.js'
import relationshipRoutes from './routes/relationships.js'
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import { db } from "./connect.js";
const app = express();
const PORT = process.env.port||8808;

//middlewares
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Credentials",true)
  next()
})
app.use(express.json())
app.use(cors())
app.use(cookieParser())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload')
  },
  filename: function (req, file, cb) {
    
    cb(null,Date.now()+ file.originalname)
  }
})

const upload = multer({ storage: storage })

app.post("/api/upload",upload.single("file"),(req, res)=>{
  const file =req.file;
  res.status(200).json(file.filename)
})

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
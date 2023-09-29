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
import axios from 'axios';
import path from 'path';
import { db } from "./connect.js";
const app = express();
const PORT = process.env.port||8808;

//middlewares
app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Credentials",true)
  next()
})
 
app.use(express.json())
let corsOptions = {
  origin : 'https://social-umber.vercel.app',
}
app.use(cors(corsOptions))
app.use(cookieParser())

app.use(express.static('public'));

// Configure Multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up a route to handle file uploads
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    // Send the uploaded image to ImgBB
    const response = await axios.post('https://api.imgbb.com/1/upload', null, {
      params: {
        key: 'b99e1b7e44deb3985e33be22d597e53f', // Replace with your ImgBB API key
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        image: req.file.buffer.toString('base64'),
      },
    });

    // Handle the ImgBB API response here
    const imageUrl = response.data.data.url;
    res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while uploading the image.' });
  }
});

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
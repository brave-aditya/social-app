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

const storage = multer.memoryStorage(); // Store the image data in memory
const upload = multer({ storage: storage });

app.use(express.json());

// Define a route for handling image uploads
app.post('/api/upload', upload.single('imageFile'), async (req, res) => {
  try {
    // Access the uploaded image data as a buffer
    const imageBuffer = req.file.buffer;

    // Make an HTTP POST request to ImgBB to upload the image
    const imgbbResponse = await axios.post('https://api.imgbb.com/1/upload', imageBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      params: {
        key: 'b99e1b7e44deb3985e33be22d597e53f', // Replace with your ImgBB API key
      },
    });

    // Extract the URL of the uploaded image from the ImgBB response
    const imageUrl = imgbbResponse.data.data.url;

    // Send the URL or other data as a response to the frontend
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
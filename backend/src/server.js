import express from 'express';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from 'url'; 
import cookiesParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("NODE_ENV:", ENV.NODE_ENV);


const PORT = ENV.PORT || 3000;

app.use(express.json()); // To parse JSON bodies res.body
app.use(cookiesParser()); // To parse cookies from incoming requests, so that we can access them via req.cookies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

console.log("Serving frontend from:", path.join(__dirname, "../../frontend/dist"));

if(ENV.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
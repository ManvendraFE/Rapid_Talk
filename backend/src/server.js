import express from 'express';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from 'url';  // 👈 add this

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();

const app = express();

// 👇 Replace path.resolve() with this
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("NODE_ENV:", process.env.NODE_ENV);


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

console.log("Serving frontend from:", path.join(__dirname, "../../frontend/dist"));

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});
}

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
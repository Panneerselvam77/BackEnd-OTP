import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnetion } from "./db.js";
import { userRouter } from "./Routes/userRoutes.js";
import { notesRouter } from "./Routes/notesRoutes.js";
// import { isAuthenticated } from "./Authentication/auth.js";

// Configureing Env
dotenv.config();

//
const app = express();
const PORT = process.env.PORT;
//  Middlewears
app.use(express.json());
app.use(cors());
dbConnetion();

//  Routes
app.get("/", (req, res) => {
  res.send("Working Good");
});

app.use("/api/user", userRouter);
// app.use("/api/notes", isAuthenticated, notesRouter);
// Server Connection
app.listen(PORT, () => console.log(`Server running in Localhost:${PORT}`));

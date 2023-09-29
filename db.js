import mongoose from "mongoose";

import dotenv from "dotenv";
// Configureing Env
dotenv.config();

// "mongodb://127.0.0.1:27017/interview"
const MongoURL = process.env.MongoURL;
// mongodb+srv://user:panneer123@cluster0.bc622a4.mongodb.net/?retryWrites=true&w=majority

export function dbConnetion() {
  const params = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    const client = mongoose.connect(MongoURL, params);
    console.log("Data Base connected successfully");
    return client;
  } catch (error) {
    console.log("Error Connecting DB----", error);
  }
}

export const client = dbConnetion();

// export function dbConnetion() {
//   const params = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   };
//   try {
//     mongoose.connect("mongodb://127.0.0.1:27017/interview", params);
//     console.log("Data Base connected successfully");
//   } catch (error) {
//     console.log("Error Connecting DB----", error);
//   }
// }

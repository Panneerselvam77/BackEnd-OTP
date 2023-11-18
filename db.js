import mongoose from "mongoose";

import dotenv from "dotenv";
// Configureing Env
dotenv.config();


const MongoURL = process.env.MongoURL;


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



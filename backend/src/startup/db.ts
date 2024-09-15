import mongoose from "mongoose";

// Connect to DB from env variable url, create instance
export function initDB() {
  
  const db = process.env.MONGO_URI || "mongodb://localhost:27017/test";

  mongoose
    .connect(db)
    .then(() => console.log(`Connected to ${db}...`))
    .catch((error) => console.log(error));
}

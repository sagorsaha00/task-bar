import mongoose from "mongoose";
import dns from "node:dns"
dns.setServers(["8.8.8.8", "8.8.4.4"])

export const initDb = async () => {
  try {
    //   const dbUrl: string = config.get('database.url')

    //   await mongoose.connect(dbUrl)
    await mongoose.connect(
      "mongodb+srv://mrartimas24:task_manager21@cluster0.djqt5qb.mongodb.net/"
    );

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

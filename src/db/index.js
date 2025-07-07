import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectdb = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log(`\n MONGODB CONNECTED! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectdb;

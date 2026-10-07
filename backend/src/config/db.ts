import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error(
        "MONGO_URI is not defined in the environment variables."
      );
    }

    const connection =
      await mongoose.connect(mongoURI);

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

    console.log(
      `MongoDB Database: ${connection.connection.name}`
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `MongoDB Connection Error: ${error.message}`
      );
    } else {
      console.error(
        "An unknown MongoDB connection error occurred."
      );
    }

    process.exit(1);
  }
};

export default connectDB;
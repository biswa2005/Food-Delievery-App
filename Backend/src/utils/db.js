import mongoose from "mongoose";

const connectDB = async () => { 
try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}

export default connectDB; 
import mongoose from "mongoose";

const init = async (): Promise<void> => {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to database");
};

const disconnect = (): Promise<void> => mongoose.disconnect()
export default { init, disconnect };

import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const ConnectDB = async () => {
  const DB_URL = "mongodb://127.0.0.1:27017/product_service_db";

  try {
    await mongoose.connect(DB_URL, { directConnection: true });
  } catch (err) {
    console.log(err);
  }
};

export { ConnectDB };

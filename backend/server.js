const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./database/database");

// config

dotenv.config({ path: "backend/config/config.env" }); // for accessing .env variables
dotenv.config({ path: "backend/config/.env" });

const start = async () => {
  try {
    // if connection is successfull then and only then we will start the server
    await connectDB(process.env.MONGO_URL);
    app.listen(
      process.env.PORT,
      console.log(`Server is listening on port ${process.env.PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

const mongoose = require("mongoose")

const connectDB = () => {
  const url = process.env.MONGO_URL
  mongoose
    .connect(url)
    .then(() => {
      console.log(
        "[MONGO]: Successfully connected to the database \n***************************"
      )
    })
    .catch((err) => {
      console.log(
        `\n[MONGO]: Could not connect to the database\n${err}\nExiting now...`
      )
      process.exit()
    })
}

module.exports = connectDB

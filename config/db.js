const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
     port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false
  }
);
console.log("DB CONFIG", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});
async function connectDB() {
  try {
    await sequelize.authenticate();

    console.log(
      "Database connected successfully"
    );

    await sequelize.sync();

    console.log(
      "Models synchronized successfully"
    );

  } catch (error) {

    console.log(
      "Database connection error",
      error
    );

  }
}

connectDB();

module.exports = sequelize;
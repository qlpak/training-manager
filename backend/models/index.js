const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

sequelize
  .sync({ alter: true }) // adding column 'role' automatically to the database
  .then(() => {
    console.log("Database synchronized successfully;-)");
  })
  .catch((error) => {
    console.error("Database synchronization failed:", error.message);
  });

const User = require("./user")(sequelize);
const Plan = require("./plan")(sequelize);

module.exports = {
  sequelize,
  User,
  Plan,
};

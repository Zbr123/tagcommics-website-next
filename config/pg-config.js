const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const pg = require("pg");
dotenv.config();

// Use DATABASE_URL if defined, else build from individual env vars
const dbUrl =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const sequelize = new Sequelize(dbUrl, {
  dialect: "postgres",
  dialectModule: pg,
  protocol: "postgres",
  logging: console.log, // set to false in production
  dialectOptions: {
    ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { sequelize };

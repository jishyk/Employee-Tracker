const mysql = require('mysql2/promise');
require('dotenv').config();

let connection;

const initDBConnection = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log("DB Connected!");
  } catch (error) {
    console.error('Error:', error);
    process.exit(1); // Exits the process in case of an error
  }
};

const getDBConnection = () => {
  if (!connection) {
    throw new Error("Connection to DB has not been initialized. Call initDBConnection first.");
  }
  return connection;
};

const closeDBConnection = async () => {
    if (connection) {
      connection.end();
        console.log("DB Connection Closed!");
    }
};

module.exports = { initDBConnection, closeDBConnection, getDBConnection };

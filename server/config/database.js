const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, "database.db");

let db = null;
const initializeDB = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
  return db;
};

module.exports = initializeDB;
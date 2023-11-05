const { Client, Pool } = require("pg");
const pgConnectionString = {
  host: "localhost",
  database: "icm",
  port: 5432,
  user: "woragis",
  password: "woragispg",
};
const usersTable = "icm_users";
const getUsers = async (req, res) => {
  const pool = new Pool(pgConnectionString);
  try {
    await pool.connect();
    const users = await pool.query(`SELECT * FROM ${usersTable};`);
    res.status(200).json(users.rows);
  } catch (error) {
  } finally {
    await pool.end();
  }
};

module.exports = { getUsers };

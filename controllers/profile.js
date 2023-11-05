const { Client, Pool } = require("pg");
const pgConnectionString = {
  host: "localhost",
  database: "icm",
  port: 5432,
  user: "woragis",
  password: "woragispg",
};

// CRUD
const usersTable = "icm_users";

// get own profile
const getProfile = async (req, res) => {
  const id = req.session.user_id;
  const client = new Client(pgConnectionString);
  try {
    await client.connect();
    const userProfile = await client.query(
      `SELECT * FROM ${usersTable} WHERE user_id=$1;`,
      [id]
    );
    res.status(200).json(userProfile.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  } finally {
    await client.end();
  }
};
const editProfile = async (req, res) => {
  const id = req.session.user_id;
  const { email, password, cpf, admin } = req.body;
  const client = new Client(pgConnectionString);
  try {
    await client.connect();
    const updatedUser = await client.query(
      `UPDATE ${usersTable} SET email=$1, password=$2, admin=$3 WHERE user_id=$4 RETURNING *;`,
      [email, password, admin, id]
    );
    res.status(200).json(updatedUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  } finally {
    await client.end();
  }
};

const deleteProfile = async (req, res) => {
  const id = req.session.user_id;
  const client = new Client(pgConnectionString);
  try {
    await client.connect();
    await client.query(`DELETE FROM ${usersTable} WHERE user_id=$1;`, [id]);
    res.status(200).json({ message: "delete user " + id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  } finally {
    await client.end();
  }
};

module.exports = { getProfile, editProfile, deleteProfile };

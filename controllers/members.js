const { Client, Pool } = require("pg");

const pgConnectionString = {
  host: "localhost",
  port: 5432,
  database: "icm",
  user: "woragis",
  password: "woragispg",
};

const membersTable = "icm_members";

const getMembers = async (req, res) => {
  const pool = new Pool(pgConnectionString);
  try {
    await pool.connect();
    const members = await pool.query(`SELECT * FROM ${membersTable};`);
    res.status(200).json(members.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  } finally {
    await pool.end();
  }
};

const insertMember = async (req, res) => {
  const { cpf, fullName, birthDate } = req.body;
  const client = new Client(pgConnectionString);
  try {
    await client.connect();
    const newMember = await client.query(
      `INSERT INTO ${membersTable} (cpf, full_name, birth_date) VALUES ($1, $2, $3) RETURNING *;`,
      [cpf, fullName, birthDate]
    );
    res.status(201).json(newMember.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  } finally {
    await client.end();
  }
};
const getMember = async (req, res) => {
  const { id } = req.params;
  const pool = new Pool(pgConnectionString);
  try {
    await pool.connect();
    const member = await pool.query(
      `SELECT * FROM ${membersTable} WHERE member_id=$1;`,
      [id]
    );
    res.status(200).json(member.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  } finally {
    await pool.end();
  }
};
const updateMember = async (req, res) => {
  const { id } = req.params;
  const { cpf, fullName, birthDate } = req.body;
  const client = new Client(pgConnectionString);

  try {
    await client.connect();
    const updatedMember = await client.query(
      `UPDATE ${membersTable} SET cpf=$1, full_name=$2, birth_date=$3 WHERE member_id=$4 RETURNING *;`,
      [cpf, fullName, birthDate, id]
    );
    res.status(200).json(updatedMember.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  } finally {
    await client.end();
  }
};
const deleteMember = async (req, res) => {
  const { id } = req.params;

  const client = new Client(pgConnectionString);

  try {
    await client.connect();
    await client.query(`DELETE FROM ${membersTable} WHERE member_id=$1;`, [id]);
    res.status(200).json({ message: "deleted user " + id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  } finally {
    await client.end();
  }
};

module.exports = {
  getMembers,
  insertMember,
  getMember,
  updateMember,
  deleteMember,
};

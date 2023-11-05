const bcrypt = require("bcrypt");
const { Client } = require("pg");

const pgConnectionString = {
  host: "localhost",
  port: 5432,
  database: "icm",
  user: "woragis",
  password: "woragispg",
};

const usersTable = "icm_users";
const membersTable = "icm_members";

const register = async (req, res) => {
  const { email, password, cpf, admin } = req.body;
  const sess = req.session;
  const client = new Client(pgConnectionString);
  try {
    await client.connect(); // connect to Postgres database

    const emailExistenceResult = await client.query(
      `SELECT EXISTS (SELECT 1 FROM ${usersTable} WHERE email=$1) as email_exists;`,
      [email]
    );
    const { email_exists } = emailExistenceResult.rows[0];
    console.log(email_exists);
    if (email_exists) {
      res.status(400).json({ message: "This email already exists" });
    } else {
      const salt = await bcrypt.genSalt(12);
      const encryptedPassword = await bcrypt.hash(password, salt);
      const memberIdResult = await client.query(
        `SELECT member_id FROM ${membersTable} WHERE cpf=$1;`,
        [cpf]
      );

      const memberId = memberIdResult.rows[0].member_id;
      console.log(`Member id: ${memberId}`);
      const user = await client.query(
        `INSERT INTO ${usersTable} (email, password, admin, member_id) VALUES ($1, $2, $3,$4) RETURNING *;`,
        [email, encryptedPassword, admin, memberId]
      );
      sess.authenticated = true;
      sess.admin = admin;
      sess.member_id = memberId;
      sess.user_id = user.rows[0].user_id;
      res.status(201).json({ message: "user created", memberId: memberId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  } finally {
    await client.end();
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const sess = req.session;
  const client = new Client(pgConnectionString);
  try {
    await client.connect();
    const encryptedPasswordResult = await client.query(
      `SELECT password FROM ${usersTable} WHERE email=$1;`,
      [email]
    );
    // search for admin true or false
    const user = await client.query(
      `SELECT admin FROM ${usersTable} WHERE email=$1;`,
      [email]
    );
    const encryptedPassword = encryptedPasswordResult.rows[0].password;
    bcrypt.compare(password, encryptedPassword, (err, same) => {
      if (same) {
        sess.admin = user.rows[0].admin;
        sess.authenticated = true;
        sess.user_id = user.rows[0].user_id;
        res
          .status(200)
          .json([
            { message: "logged in user" },
            { admin: user.rows[0].admin },
            { user: { email: email, password: password } },
          ]);
      } else {
        res.status(400).json({ message: "wrong email/password" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  } finally {
    await client.end();
  }
};

const logout = async (req, res) => {
  const sess = req.session;
  if (sess.authenticated) {
    sess.destroy();
    res.status(200).json({ message: "logged out" });
  } else {
    res.json({ message: "you're already logged out" });
  }
};

module.exports = { register, login, logout };

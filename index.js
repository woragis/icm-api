const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const cors = require("cors");

const app = express();
const server_port = 5000;
app.set("trust proxy", 1);

mongoose.connect("mongodb://localhost/icm", {});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.on("connect", () => {
  console.log("Connected to MongoDB");
});

const sessionStore = new MongoStore({
  mongoUrl: "mongodb://localhost/icm",
  collection: "sessions",
});

app.use(
  session({
    secret: "maranata o senhor jesus vem",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30, secure: false },
    store: sessionStore,
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET, POST, PUT, PATH, DELETE",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-Auth-Token",
      "X-Custom-Header",
      "Accept",
      "Cache-Control",
      "If-None-Match",
      "User-Agent",
      "Referer",
      "Cookie",
      "Origin",
      "Access-Control-Request-Headers",
    ],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logger = require("./middlewares/logger");
app.use(logger);
// const admin = require("./routes/admin");
// app.use("/admin", admin);

const accounts = require("./routes/account");
app.use("/", accounts);
const { isAuthenticated, isAdmin } = require("./middlewares/auth");
const members = require("./routes/members");
app.use("/admin/members", isAdmin, members);
const profile = require("./routes/profile");
app.use("/profile", isAuthenticated, profile);
const users = require("./routes/users");
app.use("/users", isAuthenticated, users);

app.all("/", (req, res) => {
  res.status(404).json({ message: "Page doesn't exist" });
});

app.listen(server_port, () =>
  console.log(`Server running on port ${server_port}`)
);

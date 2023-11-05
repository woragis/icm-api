const isAuthenticated = async (req, res, next) => {
  const sess = req.session;
  if (!sess.authenticated) {
    res.status(401).json({ message: "you're not authenticated" });
  } else {
    next();
  }
};
const isAdmin = async (req, res, next) => {
  const sess = req.session;
  if (!sess.authenticated) {
    res.status(401).json({ message: "you're not authenticated" });
  } else {
    if (!sess.admin) {
      res.status(403).json({ message: "you're not a admin" });
    } else {
      next();
    }
  }
};

module.exports = { isAuthenticated, isAdmin };

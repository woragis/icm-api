const { endOfDay } = require("date-fns");
const format = require("date-fns/format");

const logger = async (req, res, next) => {
  reset = "\x1b[0m";
  bright = "\x1b[1m";
  fgYellow = "\x1b[33m";
  fgMagenta = "\x1b[35m";
  fgCyan = "\x1b[36m";
  let now = new Date();
  const dateOptions = "HH:mm:ss - dd/MM/yyy";
  const requestedTime = format(now, dateOptions);
  console.log(
    `${fgYellow}${req.method}${reset} ${bright}${fgCyan}${req.url}${reset} ${fgMagenta}${requestedTime}${reset}`
  );
  next();
};

module.exports = logger;

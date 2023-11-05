const { endOfDay } = require("date-fns");
const format = require("date-fns/format");

const logger = async (req, res, next) => {
  reset = "\x1b[0m";
  bright = "\x1b[1m";
  dim = "\x1b[2m";
  fgRed = "\x1b[31m";
  fgGreen = "\x1b[32m";
  fgYellow = "\x1b[33m";
  fgBlue = "\x1b[34m";
  fgMagenta = "\x1b[35m";
  fgCyan = "\x1b[36m";
  fgWhite = "\x1b[37m";
  fgGray = "\x1b[90m";
  let now = new Date();
  const dateOptions = "HH:mm:ss - dd/MM/yyy";
  const requestedTime = format(now, dateOptions);
  let method = "";
  switch (req.method) {
    case "GET":
      method = "" + fgGreen + req.method + reset;
      break;
    case "POST":
      method = "" + fgYellow + req.method + reset;
      break;
    case "PUT":
      method = "" + fgBlue + req.method + reset;
      break;
    case "PATCH":
      method = "" + fgBlue + req.method + reset;
      break;
    case "DELETE":
      method = "" + fgRed + req.method + reset;
      break;
  }
  let url = "" + bright + fgCyan + req.url + reset;
  let time = "" + fgMagenta + requestedTime + reset;
  console.log(`${method} ${url} ${time}`);
  next();
};

module.exports = logger;

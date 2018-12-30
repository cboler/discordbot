import * as env from "dotenv";
import * as http from "http";

import expressApp from "../express-app";
import { Bot } from "../discord-bot";
import { Logger } from "../utils";
import { IBotConfig } from "../domains";

env.config();

const logger = new Logger();
const debug = require("debug")("expressApp:server");
const port = normalizePort(process.env.PORT || "3000");
const server = http.createServer(expressApp);
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;
const guilds = process.env.ALLOWED_GUILDS.split("|");

expressApp.set("port", port);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

logger.info("\nExpress Server listening on port: " + port + "\n");

const botConfig: IBotConfig = {
  discordToken: token,
  allowedGuilds: guilds,
  botListeners: [
    "ready", "guildCreate", "guildDelete", "message"
  ],
  botCommands: [
    "help", "ping", "echo"
  ],
  botActivity: "Gonking",
  botUsername: "Discord Bot",
  cmdPrefix: prefix ? prefix : "$"
};

new Bot().start(
  botConfig,
  `${__dirname}/../commands`,
  `${__dirname}/../listeners`,
  `${__dirname}/../data`
);

function normalizePort(val: any) {
  const portToNormalize = parseInt(val, 10);
  if (isNaN(portToNormalize)) {
    return val;
  }
  if (portToNormalize >= 0) {
    return portToNormalize;
  }
  return false;
}

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

  switch (error.code) {
    case "EACCES": // tslint:disable-next-line
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE": // tslint:disable-next-line
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  debug("Listening on " + bind);
}

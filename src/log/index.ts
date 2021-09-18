import bunyan = require("bunyan");
//////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * bunyan logger engine
 */
export const log = bunyan.createLogger({
  name: "rb-challenge-be",
  level: "debug",
});

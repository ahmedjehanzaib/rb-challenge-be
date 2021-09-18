import express = require("express");
import cors = require("cors");
//////////////////////////////////////////////////////////////////////////////////////////////////
// bin Server requirements
//////////////////////////////////////////////////////////////////////////////////////////////////
import { json } from "body-parser";
import { Server } from "http";
import * as passport from "passport";
import * as session from "express-session";
import * as cookieParser from "cookie-parser";

import { log } from "../log";
import { validateUser } from '../config'
import { authenticationRouter, activitiesRouter, usersRouter } from "../collections";

//////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Server initialization and middlewares
 */
//////////////////////////////////////////////////////////////////////////////////////////////////
export const app: express.Express = express();
app.locals.title = "Remotebase Challenge BE";
app.locals.email = "ahmedjehanzaib1992@gmail.com";
app.locals.issues = "";
app.locals.baseUri = "/api/v1";

app.use(
  (
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, OPTIONS"
    );
    next();
  }
);
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: "RB-CHALLENGE-BE",
    cookie: {
      maxAge: 86400000, // 1 day expiry
    },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Server routing (Standard)
 */
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get(`${app.locals.baseUri}/ping`, (_req: express.Request, res: express.Response) => {
  res.sendStatus(200);
});
// @ts-ignore
app.use(`${app.locals.baseUri}/blueprint`, express.static("docs/blueprint/", { extensions: ["html"], index: "index.html", }));
// @ts-ignore
app.use(`${app.locals.baseUri}/documentation`, express.static("docs/typedoc/", { extensions: ["html"], index: "index.html" }));
// @ts-ignore
app.use(`${app.locals.baseUri}/tests`, express.static("docs/tests/", { extensions: ["html"], index: "index.html" }));
//////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Server routing (Application)
 */
/////////////////////////////////////////////////////////////////////////////////////////////////
app.use(`${app.locals.baseUri}/authentication`, json(), authenticationRouter());
app.use(`${app.locals.baseUri}/activities`, validateUser, json(), activitiesRouter());
app.use(`${app.locals.baseUri}/users`, validateUser, json(), usersRouter());

/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Error handling and logging
 */
/////////////////////////////////////////////////////////////////////////////////////////////////
const errorHandler: express.ErrorRequestHandler = (
  error: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): void => {
  log.error(error);
  if (error.name === "UnauthorizedError")
    res.status(401).json({ message: error.message });
  else res.sendStatus(500);
  if (process.env.ENV === "development") res.send(error);
  else res.send();
};

app.use(errorHandler);

/////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Launch server
 */
////////////////////////////////////////////////////////////////////////////////////////////////
export const SERVER_PORT = parseInt(process.env.PORT || "3010");
export const server: Server = app.listen(SERVER_PORT, "", () => {
  log.debug("Server is running on port ", SERVER_PORT);
});
server.on("error", (err: Error) => {
  log.error(err);
});
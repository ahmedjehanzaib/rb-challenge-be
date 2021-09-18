import { Pool } from "pg";

import { log } from "../log";

const config: any = {
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
};

if (process.env.SSL_MODE) {
  config["ssl"] = {
    require: true,
    rejectUnauthorized: false,
  };
}

const PG_CLIENT = new Pool(config);
PG_CLIENT.connect()
  // @ts-ignore
  .then((): any => {
    log.debug("postgres database connected");
  })
  .catch((): any => {
    log.fatal("postgres database could not connect");
  });

export { PG_CLIENT };

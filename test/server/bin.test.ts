import chaiHttp = require("chai-http");
import { request, expect, use } from "chai";
import { server, app } from "../../src/bin/server";

use(chaiHttp);

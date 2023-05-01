import express from "express";
import env from "dotenv";
import routes from "./router/routes";
import connect from "./model/connectDB";
import bodyParser from "body-parser";
import cors from "cors";
import socketService from "./socket_io";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());
env.config();

const port = process.env.PORT;
const dbUrl = process.env.DATABASE_URL;

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  routes(app);
  socketService.connect(app);
  await connect(dbUrl as string);
});

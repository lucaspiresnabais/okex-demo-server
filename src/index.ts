import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { tradeRouter } from './routes/trade';
import { accountRouter } from "./routes/account";
import { transactionsRouter } from "./routes/transactions";
import { connectdb } from "./database/connection";
import { connectWs } from "./helpers/webSocket";

dotenv.config();

axios.defaults.baseURL = process.env.OKEX_URL;

const app = express();
const port = process.env.EXPRESS_PORT;

app.use(express.json());
app.use(tradeRouter);
app.use(accountRouter);
app.use(transactionsRouter);

app.listen(port, async () => {
    console.log( `server started at http://localhost:${ port }` );
    await connectdb();
    await connectWs();
    app.emit('ready');
} );

export {app}
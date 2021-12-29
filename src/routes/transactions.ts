import * as express from "express";
import { transactionMandatoryInParamsValidation } from "../helpers/validators";
import { findAllTransactions, findTransactionById } from "../database/methods";
import { validationResult } from "express-validator";
const transactionsRouter = express.Router();

transactionsRouter.get('/transactions',
    async (req: express.Request, res: express.Response) => {
        try {
            const transactions = await findAllTransactions();
            res.send(transactions);
        }
        catch(e) {
            console.log(e);
            res.status(500).send({error: "There was an issue querying the DB"});
        }
    }
)

transactionsRouter.get(
    '/transactions/:id',
    transactionMandatoryInParamsValidation(),
    async (req: express.Request, res: express.Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const transaction = await findTransactionById(id as string);
            res.send(transaction);
        }
        catch(e) {
            console.log(e);
            res.status(500).send({error: "There was an issue querying the DB"});
        }
    }
);
export { transactionsRouter };
import * as express from "express";
import cache from "memory-cache";
import { validationResult } from "express-validator";
import { 
    calculateMyFees, 
    pairToSourceAndDestination, 
    getBestPath } from "../helpers/prices";
import { 
    standardValidation, 
    transactionMandatoryInBodyValidation, 
    transactionFieldsValidation } from "../helpers/validators";
import { buildPriceResponse, buildTradeResponse } from "../helpers/responses";
import { buildDataFromResponse, insertTransaction } from "../database/methods";
import { executeTrade } from "../helpers/trades";
import { buildTransaction } from "../helpers/transactions";

const tradeRouter = express.Router();

tradeRouter.get(
    "/price", 
    standardValidation(),
    async (req: express.Request, res: express.Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(JSON.stringify({ errors: errors.array() }))
                return res.status(400).json({ errors: errors.array() });
            }

            const { pair, amount, operationType } = req.query;

            const [source, destination] = pairToSourceAndDestination(
                pair as string, operationType as string);

            const bestPath = getBestPath(
                source, 
                destination, 
                parseFloat(amount as string),
                operationType as string
            )
            
            const transaction = buildTransaction(
                bestPath, 
                pair as string, 
                parseFloat(amount as string), 
                operationType as string
            );

            const expiration = parseInt(process.env.PRICE_EXPIRATION);

            cache.put(
                `transaction_${transaction.getId()}`, 
                transaction, 
                expiration
            )

            const priceResponse = buildPriceResponse(
                bestPath, 
                transaction, 
                expiration,
                calculateMyFees(pair as string)
            )

            console.log(`priceResponse: ${JSON.stringify(priceResponse, null, 2)}`)

            res.send(priceResponse)    
        } catch(e) {
            console.log(e)
            res.status(500).send({error: e.message});
        }
    }
);

tradeRouter.post(
    "/trade", 
    standardValidation(),
    transactionMandatoryInBodyValidation(),
    async (req: express.Request, res: express.Response) => {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            const { pair, amount, operationType, transactionId } = req.body;
            
            const transaction = cache.get(`transaction_${transactionId}`);
            
            transactionFieldsValidation(transaction, {pair, amount, operationType});

            const tradeDetails = await executeTrade(transaction);

            const tradeResponse = buildTradeResponse(transaction, tradeDetails);

            const insertData = buildDataFromResponse(tradeResponse);

            await insertTransaction(insertData);

            res.send(tradeResponse);
        } catch(e) {
            console.log(e)
            res.status(500).send({error: e.message});
        }
    }
);

export { tradeRouter };
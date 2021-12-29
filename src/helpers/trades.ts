import { UserTransaction } from "../models/UserTransaction";
import { getAuthHeaders } from "./headers";
import { doGet, doPost } from "./requests";
import dotenv from "dotenv";
import { OrderDetails } from "../interfaces/IOrderDetails";

dotenv.config()

const tradeOrderPath = process.env.PATH_POST_TRADE_ORDER;
const orderDetailsPath = process.env.PATH_GET_ORDER_DETAILS;

export async function executeTrade(transaction: UserTransaction) {
    const path = transaction.getPath();
    
    let amount = transaction.getAmount();
    let tradeDetails: OrderDetails;

    for (const trade of path) {
        const pair = trade[0];
        const operationType = trade[1]

        const body = {   
            "instId": pair, 
            "tdMode": "cash",
            "side": operationType,
            "ordType": "market",
            "sz": amount,
        }
        
        const tradeResponse = await doPost(
            tradeOrderPath, 
            getAuthHeaders('POST', tradeOrderPath, JSON.stringify(body)), 
            body            
        );

        //console.log(tradeResponse.data)

        const orderId = tradeResponse?.data?.data[0]?.ordId;

        if (!orderId) {
            throw new Error(
                `There was an issue calling Okex's ${tradeOrderPath}:
                ${JSON.stringify(tradeResponse?.data)}`
            )
        }
        const order = await doGet(
            orderDetailsPath, 
            getAuthHeaders('GET', `${orderDetailsPath}?instId=${pair}&ordId=${orderId}`),
            {"instId": pair, "ordId": orderId}
        )
        
        tradeDetails = order?.data?.data[0];
        
        if (!tradeDetails) {
            throw new Error(`There was an issue calling Okex's ${orderDetailsPath}`)
        }

        //console.log(tradeDetails)

        if(tradeDetails.state === 'cancelled') throw new Error(`Could not complete one or more orders`)

        amount = operationType === 'buy' ? 
            parseFloat(tradeDetails.accFillSz) : 
            parseFloat(tradeDetails.accFillSz) * parseFloat(tradeDetails.avgPx);

        tradeDetails.amountObtained = amount;

    }

    return tradeDetails;

}
import * as express from "express";
import { doGet } from "../helpers/requests";
import { getAuthHeaders } from "../helpers/headers";

const accountRouter = express.Router();

accountRouter.get("/accountBalance", async(req, res ) => {
    const accountBalancePath = process.env.PATH_GET_ACCOUNT_BALANCE;
    try {
        const response = await doGet(
            accountBalancePath,
            getAuthHeaders('GET', accountBalancePath)        
        );

        const accountDetails = response.data?.data[0]?.details;

        if (!accountDetails) {
            throw new Error("Account details couldn't be retrieved")
        }
    
        const sanitizedResponse = accountDetails.filter((currencyInfo: { ccy: string; }) => {
            return currencyInfo.ccy === "BTC" || currencyInfo.ccy === "USDT" ||
            currencyInfo.ccy === "ETH" || currencyInfo.ccy === "ADA"
        })
        
        res.send(sanitizedResponse)
    } catch (e){
        console.log(e)
        res.status(500).send({error: e.message});
    }
});

export {accountRouter}
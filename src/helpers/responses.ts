import { UserTransaction } from "../models/UserTransaction";
import { OrderDetails } from "../interfaces/IOrderDetails";
import { TradeResponse } from "../models/TradeResponse";
import { calculateMyFees } from "./prices";
import { IPath } from "../interfaces/IPath";
import { PriceResponse } from "../models/PriceResponse";
import { Fees } from "../models/Fees";

export function buildTradeResponse(
    transaction: UserTransaction, 
    orderDetails: OrderDetails,
    ): TradeResponse {

    const userAmount = calculateUserAmount(
        transaction
    );

    const executionPrice = calculateExecutionPrice(
        transaction, orderDetails
    );

    const tradeResponse = new TradeResponse();
    tradeResponse.setTransactionId(transaction.getId())
    tradeResponse.setUserPrice(transaction.getUserPrice());
    tradeResponse.setUserAmount(userAmount);
    tradeResponse.setExecutionPrice(executionPrice);
    tradeResponse.setExecutionAmount(orderDetails.amountObtained);
    tradeResponse.setPair(transaction.getPair());
    tradeResponse.setOperationType(transaction.getOperationType());
    tradeResponse.setOperationSize(transaction.getAmount());

    tradeResponse.setFees(calculateMyFees(transaction.getPair()));

    return tradeResponse;
}

export function buildPriceResponse(
    bestPath: IPath, 
    transaction: UserTransaction,
    expiration: number,
    fees: Fees
): PriceResponse {
    return new PriceResponse(
        bestPath.userPrice, 
        bestPath.marketPrice, 
        transaction.getId(), 
        expiration, 
        fees
        );
}


function calculateUserAmount(transaction: UserTransaction): number {

    const operationType = transaction.getOperationType();
    const userPrice = transaction.getUserPrice();
    const size = transaction.getAmount();

    return operationType === 'buy' ? size / userPrice : size * userPrice;
}

function calculateExecutionPrice(
    transaction: UserTransaction, 
    orderDetails: OrderDetails
): number {
    const operationType = transaction.getOperationType();
    const size = transaction.getAmount();
    const amount = orderDetails.amountObtained;

    return operationType === 'buy' ? size / amount : amount / size;
}

import { IPath } from "../interfaces/IPath";
import { UserTransaction } from "../models/UserTransaction";

export function buildTransaction(
    bestPath: IPath, 
    pair: string, 
    amount: number, 
    operationType: string
) {
    const transactionId = Math.random().toString(36).slice(2);
       
    return new UserTransaction(
        transactionId,
        amount,
        pair,
        operationType,
        bestPath.userPrice,
        bestPath.formattedPath,
    );
}
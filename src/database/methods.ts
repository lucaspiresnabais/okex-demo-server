import { sequelize } from './connection';
import { initTransaction } from "../database/models/Transaction";
import { ITransaction } from '../interfaces/ITransaction';
import { TradeResponse } from '../models/TradeResponse';

const Transaction = initTransaction(sequelize);

export async function insertTransaction(data: ITransaction) {
    try {
        return await Transaction.create(data);
    }catch(e){
        console.log(e)
    }
}

export async function findAllTransactions() {
    try {
        return await Transaction.findAll();
    }catch(e){
        console.log(e)
    }
}

export async function findTransactionById(transactionId: string){
    try {
        return await Transaction.findAll(
            {
                where: {
                    transactionid: transactionId
                }
            }
        );
    }catch(e){
        console.log(e)
    }
}

export function buildDataFromResponse(data: TradeResponse) {
    
    const transactionData = {
        transactionid: data.getTransactionId(),
        pair: data.getPair(),
        operationtype: data.getOperationType(),
        size: data.getOperationSize(),
        userprice: data.getUserPrice(),
        useramount: data.getUserAmount(),
        executionprice: data.getExecutionPrice(),
        executionamount: data.getExecutionAmount(),
        feecurrency: data.getFees().getCurrency(),
        feeamount: data.getFees().getAmount(),
    }

    return transactionData;
}
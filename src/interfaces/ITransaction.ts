export interface ITransaction {
    transactionid: string;
    pair: string;
    operationtype: string;
    size: number;
    userprice: number;
    executionprice: number;
    useramount: number;
    executionamount: number;
    feecurrency: string;
    feeamount: number;
}
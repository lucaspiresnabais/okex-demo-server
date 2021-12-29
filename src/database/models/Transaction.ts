import { DataTypes, Model, Sequelize } from 'sequelize'

export class Transaction extends Model {
    public transactionid: string;
    public pair: string;
    public operationtype: string;
    public size: number;
    public userprice: number;
    public useramount: number;
    public executionprice: number;
    public executionamount: number;
    public feecurrency: string;
    public feeamount: string;
}

export const initTransaction = (sequelize: Sequelize) => {
    Transaction.init(
        {
            transactionid: {
                type: DataTypes.STRING,
            },
            pair: {
                type: DataTypes.STRING
            },
            operationtype: {
                type: DataTypes.STRING
            },
            size: {
                type: DataTypes.NUMBER
            },
            userprice: {
                type: DataTypes.NUMBER
            },
            executionprice: {
                type: DataTypes.NUMBER
            },
            useramount: {
                type: DataTypes.NUMBER
            },
            executionamount: {
                type: DataTypes.NUMBER
            },
            feecurrency: {
                type: DataTypes.STRING
            },                        
            feeamount: {
                type: DataTypes.STRING
            },  
        },
        {
            tableName: 'transactions',
            sequelize, 
            timestamps: true,
        }
    );

    return Transaction;
};
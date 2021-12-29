import { Fees } from "./Fees";

export class TradeResponse {
    private transactionId: string;
    private userPrice: number;
    private userAmount: number;
    private executionPrice: number;
    private executionAmount: number;
    private pair: string;
    private operationCurrency: string;
    private operationType: string;
    private operationSize: number;
    private fees: Fees;

    public getTransactionId(): string {
        return this.transactionId;
    }
    public setTransactionId(value: string) {
        this.transactionId = value;
    }
    public getUserPrice(): number {
        return this.userPrice;
    }
    public setUserPrice(value: number) {
        this.userPrice = value;
    }
    public getUserAmount(): number {
        return this.userAmount;
    }
    public setUserAmount(value: number) {
        this.userAmount = value;
    }
    public getExecutionPrice(): number {
        return this.executionPrice;
    }
    public setExecutionPrice(value: number) {
        this.executionPrice = value;
    }
    public getPair(): string {
        return this.pair;
    }
    public setPair(value: string) {
        this.pair = value;
    }
    public getOperationCurrency(): string {
        return this.operationCurrency;
    }
    public setOperationCurrency(value: string) {
        this.operationCurrency = value;
    }
    public getOperationType(): string {
        return this.operationType;
    }
    public setOperationType(value: string) {
        this.operationType = value;
    }
    public getOperationSize(): number {
        return this.operationSize;
    }
    public setOperationSize(value: number) {
        this.operationSize = value;
    }
    public getExecutionAmount(): number {
        return this.executionAmount;
    }
    public setExecutionAmount(value: number) {
        this.executionAmount = value;
    }
    public getFees(): Fees {
        return this.fees;
    }
    public setFees(value: Fees) {
        this.fees = value;
    }
}
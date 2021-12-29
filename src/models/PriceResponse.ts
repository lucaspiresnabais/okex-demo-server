import { Fees } from "./Fees";

export class PriceResponse {
    private userPrice: number;
    private marketPrice: number;
    private transactionId: string;
    private expiration: number;
    private fees: Fees;

    constructor(
        _userPrice: number,
        _marketPrice: number, 
        _transactionId: string, 
        _expiration: number, 
        _fees: Fees
    ) {

        this.userPrice = _userPrice;
        this.marketPrice = _marketPrice;
        this.transactionId = _transactionId;
        this.expiration = _expiration;
        this.fees = _fees        
    }

    public getUserPrice(): number {
        return this.userPrice;
    }
    public setUserPrice(value: number) {
        this.userPrice = value;
    }
    public getMarketPrice(): number {
        return this.marketPrice;
    }
    public setMarketPrice(value: number) {
        this.marketPrice = value;
    }
    public geTransactionId(): string {
        return this.transactionId;
    }
    public setTransactionId(value: string) {
        this.transactionId = value;
    }
    public getExpiration(): number {
        return this.expiration;
    }
    public setExpiration(value: number) {
        this.expiration = value;
    }
    public getFees(): Fees {
        return this.fees;
    }
    public setFees(value: Fees) {
        this.fees = value;
    }
}


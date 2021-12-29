export class Fees {
    private currency: string;
    private amount: number;
    
    public getCurrency(): string {
        return this.currency;
    }
    public setCurrency(value: string) {
        this.currency = value;
    }
    public getAmount(): number {
        return this.amount;
    }
    public setAmount(value: number) {
        this.amount = value;
    }
}
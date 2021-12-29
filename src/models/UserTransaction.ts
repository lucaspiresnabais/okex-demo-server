export class UserTransaction {
    private id: string;
    private amount: number;
    private pair: string;
    private operationType: string;
    private userPrice: number;
    private path: Array<Array<string>>;

    constructor(
        _id: string, 
        _amount: number, 
        _pair: string, 
        _operationType: string,
        _userPrice: number, 
        _path: Array<Array<string>>
    ) {
        this.id = _id;
        this.amount = _amount;
        this.pair =_pair;
        this.operationType = _operationType;
        this.userPrice = _userPrice;
        this.path = _path;
    }
       
    public getId(): string {
        return this.id;
    }
    public setId(value: string) {
        this.id = value;
    }

    public getAmount(): number {
        return this.amount;
    }
    public setAmount(value: number) {
        this.amount = value;
    }
    
    public getPair(): string {
        return this.pair;
    }
    public setPair(value: string) {
        this.pair = value;
    }
    
    public getOperationType(): string {
        return this.operationType;
    }
    public setOperationType(value: string) {
        this.operationType = value;
    }
    public getUserPrice(): number {
        return this.userPrice;
    }
    public setUserPrice(value: number) {
        this.userPrice = value;
    }
    public getPath(): Array<Array<string>> {
        return this.path;
    }
    public setPath(value: Array<Array<string>>) {
        this.path = value;
    }

}
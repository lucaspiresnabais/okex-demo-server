import { expect } from "chai";
import { app } from "../src/index";
import { sequelize } from "../src/database/connection";
import { initTransaction } from "../src/database/models/Transaction";
import { Response } from "supertest";
import request from "supertest";

before ((done) => {
  app.on('ready', () => done())
})

describe("Unit Tests", () =>  {
  it("GET /transactions", async function () {
    const response = await request(app).get("/transactions");   

    const Transaction = initTransaction(sequelize);

    const transactions = await Transaction.findAll();

    expect(response.status).to.eql(200);
    expect(response.body.length).to.eql(transactions.length);
  });

  it("GET /price buy", async function () {
    await testPrice("USDT-USDC", 35, "buy");
  });

  it("GET /price sell", async function () {
    await testPrice("USDT-USDC", 2, "sell");
  });

  it("POST /trade - Price Expired!", async function () {

    const body = {
      pair: "ETH-USDT",
      amount: 15,
      operationType: "buy",
      transactionId: "708sui4x98m"
    };

    const response = 
      await request(app)
            .post("/trade")
            .send(body);   

    expect(response.status).to.eql(500);
    expect(response.body.error).to.eql("Price expired!");
  });
});

export async function testPrice(pair: string, amount: number, operationType: string) {
  const response = 
  await request(app)
        .get("/price")
        .query({
          pair,
          amount,
          operationType
        });

  expect(response.status).to.eql(200);
  expect(response.body.userPrice).to.be.a('number');
  expect(response.body.marketPrice).to.be.a('number');
  expect(response.body.transactionId).to.be.a('string');
  expect(response.body.expiration).to.be.a('number');
  expect(response.body.fees?.amount).to.be.a('number');
  expect(response.body.fees?.currency).to.be.a('string');

  const userPrice = response.body.userPrice;
  const marketPrice = response.body.marketPrice;
  const spread = operationType === "buy" ? process.env.BUY_SPREAD : process.env.SELL_SPREAD;
  const expectedUserPrice = marketPrice*parseFloat(spread);

  expect(userPrice).to.eql(expectedUserPrice);

  return response;
}

export async function testTrade(
  pair: string, 
  amount: number, 
  operationType: string,
  transactionId: string,
  expectedUserPrice: number
) {
  const body = {
    pair,
    amount,
    operationType,
    transactionId
  }

  const tradeResponse = 
      await request(app)
          .post("/trade")
          .send(body);  

  expect(tradeResponse.status).to.eql(200);
  expect(tradeResponse.body.userPrice).to.eql(expectedUserPrice);
  expect(tradeResponse.body.pair).to.eql(pair);
  expect(tradeResponse.body.operationSize).to.eql(amount);
  expect(tradeResponse.body.operationType).to.eql(operationType);

  return tradeResponse;
}

export async function testTransactionById(
  tradeResponse: Response
){

  const transactionId = tradeResponse.body.transactionId;
  const expectedPair = tradeResponse.body.pair;
  const expectedOperationType = tradeResponse.body.operationType;
  const expectedUserPrice = tradeResponse.body.userPrice;
  const expectedSize = tradeResponse.body.operationSize;
  
  const transactionByIdResponse = 
      await request(app)
        .get(`/transactions/${transactionId}`)
  
  const transaction = transactionByIdResponse.body[0];

  expect(transactionByIdResponse.status).to.eql(200);
  expect(transaction.pair).to.eql(expectedPair);
  expect(transaction.operationtype).to.eql(expectedOperationType);
  expect(parseFloat(transaction.userprice)).to.eql(expectedUserPrice);
  expect(parseFloat(transaction.size)).to.eql(expectedSize);

}
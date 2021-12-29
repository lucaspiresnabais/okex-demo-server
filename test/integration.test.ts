import { testPrice, testTrade, testTransactionById } from "./unit.test";

describe("Integration Tests", () =>  {
  it("GET /price & POST /trade > ETH, 50, BUY", async function () {
    await priceAndTrade("ETH-USDT", 100, "buy");
  });

  it("E2E > ETH, 2, SELL", async function () {
    const pair = "ADA-USDC";
    const amount = 100;
    const operationType = "sell";
    const tradeResponse = await priceAndTrade(pair, amount, operationType);
    console.log("Testing /transactionById...")
    await testTransactionById(tradeResponse);
  });
});

async function priceAndTrade(pair: string, amount: number, operationType: string) {
    console.log("Testing /price...")
    const priceResponse = await testPrice(pair, amount, operationType);
    const transactionId = priceResponse.body.transactionId;
    const expectedUserPrice = priceResponse.body.userPrice;
    console.log("Testing /trade...")
    const tradeResponse = await testTrade(pair, amount, operationType, transactionId, expectedUserPrice)
    return tradeResponse;
}
/* 
    Checks all the required env variables 
    are set so it's not necessary
    to check them one by one through the project
*/
const dotenv = require("dotenv");

dotenv.config();

let requiredEnv = [
  'API_KEY', 'SECRET_KEY',
  'PASSPHRASE', 'EXPRESS_PORT',
  'OKEX_URL','PRICE_EXPIRATION', 
  'BUY_SPREAD','SELL_SPREAD', 'BTC_FEE',
  'ETH_FEE', 'ADA_FEE', 'DEFAULT_FEE',
  'PATH_GET_ORDER_BOOK', 'PATH_POST_TRADE_ORDER',
  'PATH_GET_ORDER_DETAILS', 'PATH_GET_ACCOUNT_BALANCE',
  'DB_CONNECTION_STRING', "OKEX_WEBSOCKET_URL"
];

let unsetEnv = requiredEnv.filter((env) => {
    return (!(typeof process.env[env] !== 'undefined') ||
        (process.env[env] === "")
    )
});


if (unsetEnv.length > 0) {
  throw new Error("Required ENV variables are not set: [" + unsetEnv.join(', ') + "]");
}
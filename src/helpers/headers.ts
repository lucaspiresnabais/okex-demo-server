import CryptoJS from "crypto-js";

/*
    Gets the auth headers for the Okex account
*/
function getAuthHeaders(method: string, path: string, body?:string) {

    const timeStamp = new Date().toISOString();
    const authHeaders = {
        'OK-ACCESS-KEY': process.env.API_KEY,
        'OK-ACCESS-SIGN': getSign(timeStamp, method, path, body || ""),
        'OK-ACCESS-TIMESTAMP': timeStamp,
        'OK-ACCESS-PASSPHRASE': process.env.PASSPHRASE,
        'x-simulated-trading': '1'
    }

    return authHeaders;
  };


/*
  Encodes and hashes the sign
*/
function getSign(timeStamp: string, method: string, path: string, body?: string) {  
    return CryptoJS.enc.Base64.stringify(
        CryptoJS.HmacSHA256(timeStamp + method + path + body, process.env.SECRET_KEY)
    );
}

export {getAuthHeaders};
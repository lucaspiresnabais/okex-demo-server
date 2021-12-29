import { OKEX_PAIRS } from "./constants";
import WebSocket from 'ws';

export const orderBookList: any = {}

export async function connectWs(): Promise<void>{
    return new Promise((resolve,  reject) => {
        let counter = 0;
        const ws = new WebSocket(process.env.OKEX_WEBSOCKET_URL);
        ws.on('open', function open() {
            console.log("WS connected!")
            for(const pair of OKEX_PAIRS){
                const msg = {
                    "op": "subscribe",
                    "args": [
                    {
                        "channel": "books5",
                        "instId": pair
                    }
                    ]
                }
                ws.send(JSON.stringify(msg));
            }
        });

        ws.on('message', function message(data) {
            const parsedData = JSON.parse(data.toString());

            if (parsedData.event !== "subscribe") {
                const pair = parsedData.data[0].instId.replace(/\s/g,'');

                const orderBook = parsedData.data;

                orderBookList[pair] = orderBook;
                counter = Object.keys(orderBookList).length;
                if (OKEX_PAIRS.length === counter) resolve();
            }
        });

    })
    
};
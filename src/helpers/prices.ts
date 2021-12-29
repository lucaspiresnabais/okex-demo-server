
import { IPath } from "../interfaces/IPath";
import { Fees } from "../models/Fees";
import { 
    CLASS_A_ASSETS, 
    CLASS_B_ASSETS, 
    OKEX_PAIRS, 
    PAIRS_FROM_TO
} from "./constants";
import { orderBookList } from "./webSocket"


export function getBestPath(
    source: string, 
    destination: string,
    amount: number, 
    operationType: string
): IPath {

    const pathsData = calculatePathsData(
        source, 
        destination, 
        amount, 
        [source]);

    console.log(`PathsData: ${JSON.stringify(pathsData, null, 2)}`)

    const bestPathData = pathsData[0];

    const bestPath = bestPathData.path;

    let formattedPath = [];

    for(let i = 0; i < bestPath.length-1; i++) {
        formattedPath.push(sourceAndDestinationToPair(bestPath[i], bestPath[i+1]))
    }      

    bestPathData.formattedPath = formattedPath;

    const marketPrice = operationType === 'buy' ? 
        amount / bestPathData.volume :
        bestPathData.volume / amount;
        
    const userPrice = calculateUserPrice(marketPrice, operationType);

    bestPathData.marketPrice = marketPrice;
    bestPathData.userPrice = userPrice;

    return bestPathData;
}

/*
    Calculates the best path to go from 
    assetA to assetB.

    How much of assetB will I get given an
    amount of assetA for each path? 
*/
export function calculatePathsData(
    source: string, 
    destination: string,
    volume: number, 
    visited: Array<string>,
): any {

    return PAIRS_FROM_TO
        .filter(pair => (pair.from === source &&
            !visited.includes(pair.to)
        ))
        .map(pair => {
            if (pair.to === destination) {
                return {path: [...visited, pair.to], volume: calculateVolume(source, destination, volume)};
            } else {
                return calculatePathsData(
                    pair.to, 
                    destination, 
                    calculateVolume(source, pair.to, volume), 
                    [...visited, pair.to],
                );
            }
        })
        .flat(Infinity)
        .sort((path1, path2) => path2.volume - path1.volume);
};


/*
    Calculates volume obtained in one currency given an 
    amount of another currency.
*/
export function calculateVolume(
     source: string, 
     destination: string, 
     amount: number
): number {
    const [pair, operationType] = sourceAndDestinationToPair(source, destination);
    const orderBooks = orderBookList[pair];

    //console.log(`orderBooks: ${JSON.stringify(orderBooks)}`)
    
    if (orderBooks) {
        if (operationType === 'buy') {
            const orderBook = orderBooks[0].asks;
            return resolveAssetVolumeOnBuy(orderBook, amount, pair);
        }else{
            const orderBook = orderBooks[0].bids;
            return resolveAssetVolumeOnSell(orderBook, amount, pair);
        };
    }
};

/*
    calculateVolume() in case of buying
*/
function resolveAssetVolumeOnBuy(
    orderBook: Array<Array<string>>,
    amount: number, 
    pair: string,
): number {
    let sizeReached = 0;
    let volume = 0;

    for (let order of orderBook) { 
        const price = parseFloat(order[0]);
        const sizeOnBaseCcy = parseFloat(order[1]);
        const sizeOnSecondaryCcy = sizeOnBaseCcy*price;

        if ((sizeReached + sizeOnSecondaryCcy) > amount) {
            volume = volume + ((amount-sizeReached) / price);
            return volume - volume*(calculateOkexFees(pair))
        }    

        volume = volume + sizeOnBaseCcy;
        sizeReached = sizeReached + sizeOnSecondaryCcy;
    }
    console.log(`returning -Infinity for pair ${pair}`)
    return -Infinity;
}

/*
    calculateVolume() in case of selling
*/
function resolveAssetVolumeOnSell(
    orderBook: Array<Array<string>>,
    amount: number, 
    pair: string,
): number {
    let sizeReached = 0;
    let volume = 0;

    for (let order of orderBook) { 
        const price = parseFloat(order[0]);
        const sizeOnBaseCcy = parseFloat(order[1]);
        const sizeOnSecondaryCcy = sizeOnBaseCcy*price;

        if ((sizeReached + sizeOnBaseCcy) > amount) {
            volume = volume + ((amount-sizeReached) * price);
            return (volume - volume*(calculateOkexFees(pair)))
        }    
            
        volume = volume + sizeOnSecondaryCcy; 
        sizeReached = sizeReached + sizeOnBaseCcy; 
    }
    console.log(`returning -Infinity for pair ${pair}`)
    return -Infinity;
}

/*
    Adds the spread to the price calculation
*/
export function calculateUserPrice(executionPrice: number, operation: string): number {
    const spread = 
        operation === "buy" ? parseFloat(process.env.BUY_SPREAD) : 
            parseFloat(process.env.SELL_SPREAD);
    return executionPrice * spread;
}

/*
    Calculates my fees based on a pair 
*/ 
export function calculateMyFees(pair: string): Fees {
    const fees = new Fees();
    switch (pair) {
        case "BTC-USDT": 
            fees.setAmount(parseFloat(process.env.BTC_FEE))
            fees.setCurrency("BTC")
            return fees;
        case "ETH-USDT": 
            fees.setAmount(parseFloat(process.env.ETH_FEE))
            fees.setCurrency("ETH")
            return fees;
        case "ADA-USDC": 
            fees.setAmount(parseFloat(process.env.ADA_FEE))
            fees.setCurrency("ADA")
            return fees;
        default: 
            fees.setAmount(parseFloat(process.env.DEFAULT_FEE))
            fees.setCurrency("USD")
        return fees;
    };
}

/*
    Calculates Okex fees based on a pair 
*/ 
export function calculateOkexFees(pair: string): number {
    if(CLASS_A_ASSETS.includes(pair)) return parseFloat(process.env.CLASS_A_FEE);
    if(CLASS_B_ASSETS.includes(pair)) return parseFloat(process.env.CLASS_B_FEE);
    throw new Error("Unable to calculate Okex Fees. Invalid pair.")
}
/*
    Converts a pair into source and destination
*/
export function pairToSourceAndDestination(
    pair: string,
    operationType: string
): Array<string> {
    let source;
    let destination;

    const splitPair = pair.split('-');
    
    if(operationType === 'buy') { 
        source = splitPair[1];
        destination = splitPair[0];
    } else { 
        source = splitPair[0];
        destination = splitPair[1];        
    }
    return [source, destination]
}

/*
    Converts a source and destination into a pair
*/
function sourceAndDestinationToPair(
    source: string,
    destination: string
): Array<string> {
    const pairOp1 = `${source}-${destination}`;
    const pairOp2 = `${destination}-${source}`;

    if(OKEX_PAIRS.includes(pairOp1)) return [pairOp1, "sell"];
    if(OKEX_PAIRS.includes(pairOp2)) return [pairOp2, "buy"];

    throw new Error("Invalid pair!");
}

import axios, { AxiosRequestHeaders } from "axios";
import { UserTransaction } from "../models/UserTransaction";

/*
    Extracts boilerplate for GET requests
*/
async function doGet(path: string, headers: AxiosRequestHeaders, params?: Object) {
    return await axios.get(
        path,
        {
            headers,
            params,
        }
    )
}

/*
    Extracts boilerplate for POST requests
*/
async function doPost(path: string, headers: AxiosRequestHeaders, body: Object) {
    return await axios.post(
        path,
        body,
        {
            headers
        }
    )
}

export {doGet, doPost};
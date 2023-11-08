import axios from "axios";

export const backendconfig = axios.create({
    baseURL:'https://api-gateway-g8ad.onrender.com/apigateway/v1/',
})

import axios from 'axios';

const SERVER_IP = `${process.env.REACT_APP_RESTAPI_SERVER_IP}`;
const SERVER_PORT = `${process.env.REACT_APP_RESTAPI_SERVER_PORT}`;
const DEFAULT_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

export const request = async (method, url, headers, data, responseType ) => {
    return await axios({
        method,
        url : `${DEFAULT_URL}${url}`,
        headers,
        data,
        responseType
    }).catch(error => console.log(error));
}
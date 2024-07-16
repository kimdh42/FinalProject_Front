import axios from "axios";
import { getAccessTokenHeader, getRefreshTokenHeader, saveToken } from './TokenUtils';

const SERVER_IP = `${process.env.REACT_APP_RESTAPI_SERVER_IP}`;
const SERVER_PORT = `${process.env.REACT_APP_RESTAPI_SERVER_PORT}`;
const DEFAULT_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

/* 토큰 전달이 필요없는 기능 호출 시 사용하는 함수 */
export const request = async (method, url, headers, data) => {
    return await axios({
        method,
        url : `${DEFAULT_URL}${url}`,
        headers,
        data
    }).catch(error => {
        console.log(error)
    });
}


/* 토큰 전달이 필요한 기능 호출 시 사용하는 함수 */
export const authRequest = axios.create({baseURL : DEFAULT_URL});

authRequest.interceptors.request.use((config) => {
    config.headers['Access-Token'] = getAccessTokenHeader();
    return config;
});

authRequest.interceptors.response.use(

    /* 첫 번째 인자로 사용되는 콜백 함수는 정상 수행 시의 동작 -> 별도의 동작 없이 수행 */
    (response) => {
        return response;
    },

    /* 두 번째 인자로 사용되는 콜백 함수는 오류 발생 시 동작 -> 로직 작성 */
    async (error) => {

        const {
            config,
            response : { status }
        } = error;

        if(status === 401) {

            const originRequest = config;

            // refresh token 전달해서 토큰 재발급 요청
            const response = await postRefreshToken();

            if(response.status === 200) {
                // 토큰 재발급 성공
                saveToken(response.headers);

                // 실패했던 요청 재요청
                originRequest.headers['Access-Token'] = getAccessTokenHeader();
                return axios(originRequest);
            }
        }

        return Promise.reject(error);
    }
);

// refresh token 전달해서 토큰 재발급 요청 api
export async function postRefreshToken() {

    return await request(
        'POST',
        '/emp/auth/refresh-token',
        { 'Refresh-Token' : getRefreshTokenHeader() }
    );
}
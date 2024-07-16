import { removeToken, saveToken } from "./TokenUtils";
import { authRequest, request } from "./api";
import { success } from "../../modules/LoginModules";
import { toast } from "react-toastify";

export const callLoginAPI = ({loginRequest}) => {
    
    return async (dispatch, getState) => {
        
        const result = await request(
            'POST',
            '/emp/auth/login',
            {'Content-Type' : 'application/json'},
            JSON.stringify(loginRequest)
        );

        if(result?.status === 200) {
            saveToken(result.headers);
            dispatch(success());
        } else {
            toast.error("아이디와 비밀번호를 확인해주세요");
        }
    }
}

export const callLogoutAPI = () => {
    
    return async (dispatch, getState) => {

        const result = await authRequest.post(`/employee/logout`);
        
        if(result.status === 200) {
            removeToken();
            dispatch(success());
            alert("로그아웃 되었습니다.");
        } 
    }
}
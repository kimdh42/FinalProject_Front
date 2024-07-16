import { useState } from "react";
import { useDispatch } from "react-redux";
import { callLoginAPI } from "./LoginAPICalls";

function LoginForm() {

    const dispatch = useDispatch();
    const [form, setFrom] = useState({});

    const onChangeHandler = e => {
        setFrom({
            ...form,
            [e.target.name] : e.target.value
        });
    } 

    const onClickLoginHandler = () => {
        dispatch(callLoginAPI({ loginRequest : form }));
    }

    return (
        <>

            <div className="hp_w70">
                <input 
                    type="text" 
                    name="emp_code"
                    className="hp_w100 hp_dpBlock" 
                    placeholder="아이디" 
                    onChange={ onChangeHandler }
                />
                <input 
                    type="password"
                    name="emp_pass"
                    className="hp_w100 hp_mt10" 
                    placeholder="비밀번호" 
                    onChange={ onChangeHandler }
                />
            </div>
            <button 
            type="submit" 
            className="el_btnF hp_wAuto ly_fgrow1 el_btnLogin hp_ml10"
            onClick={ onClickLoginHandler }
            >
                로그인
            </button>

        </>
    )
}

export default LoginForm;
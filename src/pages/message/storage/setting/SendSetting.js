import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callDelAllSendMsgAPI, callSendMsgListAPI } from "../../../../apis/MessageAPICalls";

function SendSetting() {
    const dispatch = useDispatch();
    const sendMessages = useSelector(state => state.messageReducer.sendMessage.message);

    useEffect(() => {
        dispatch(callSendMsgListAPI());
    }, [dispatch]);

    // 전체 메세지 비우기
    const sendMsgClearHandler = () => {
        try {
            const msgCodes = (sendMessages && sendMessages.map(msg => msg.msgCode));
            dispatch(callDelAllSendMsgAPI(msgCodes));
            window.location.reload();
        } catch (error) {
            console.log('error : ', error);
        }
    }

    return (
        <tr>
            <td>보낸 쪽지</td>
            <td>0/{sendMessages && sendMessages.length}</td>
            <td>
                <button type="button" className="el_btnS el_btn8Back hp_ml5" onClick={sendMsgClearHandler}>비우기</button>
            </td>
        </tr>
    );
}

export default SendSetting;
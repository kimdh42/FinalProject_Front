import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callDelAllWorkMsgAPI, callWorkMsgListAPI } from "../../../../apis/MessageAPICalls";

function WorkSetting() {
    const dispatch = useDispatch();
    const workMessages = useSelector(state => state.messageReducer.workMessage.message);

    useEffect(() => {
        dispatch(callWorkMsgListAPI());
    }, [dispatch]);

    // 전체 메세지 비우기
    const workMsgClearHandler = () => {
        try {
            const msgCodes = (workMessages && workMessages.map(msg => msg.msgCode));
            dispatch(callDelAllWorkMsgAPI(msgCodes));
            window.location.reload();
        } catch (error) {
            console.log('error : ', error);
        }
    }

    return (
        <tr>
            <td>업무 보관함</td>
            <td>0/{workMessages && workMessages.length}</td>
            <td>
                <button type="button" className="el_btnS el_btn8Back hp_ml5" onClick={workMsgClearHandler}>비우기</button>
            </td>
        </tr>
    );
}

export default WorkSetting;
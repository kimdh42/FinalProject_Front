import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callDelAllMsgAPI, callRevMsgListAPI, callUpdateAllRevMsgAPI } from "../../../../apis/MessageAPICalls";

function RevSetting() {
    const dispatch = useDispatch();
    const revMessages = useSelector(state => state.messageReducer.revMessage.message);

    useEffect(() => {
        dispatch(callRevMsgListAPI());
    }, [dispatch])

    // 안읽은 쪽지 개수
    const unread = (revMessages && revMessages.filter(msg => msg.msgStatus === 'N').length);

    // 전체 쪽지 읽음 처리
    const revMsgAllReadHandler = () => {

        try {
            const unreadMsgCodes = (revMessages && revMessages.filter(msg => msg.msgStatus === 'N').map(msg => msg.msgCode));
            dispatch(callUpdateAllRevMsgAPI(unreadMsgCodes));
            window.location.reload();       

        } catch (error) {
            console.log("error : ", error);
        }
         
    };

    // 전체 메세지 비우기
    const revMsgClearHandler = () => {
        try {
            const msgCodes = (revMessages && revMessages.map(msg => msg.msgCode));
            dispatch(callDelAllMsgAPI(msgCodes));
            window.location.reload();
        } catch (error) {
            console.log('error : ', error);
        }
    }

    return (
        <tr>
            <th scope="row" rowSpan={2}>기본 보관함</th>
            <td>받은 쪽지</td>
            <td>{unread}/{revMessages && revMessages.length}</td>
            <td>
                <button type="button" className="el_btnS el_btnblueBack" onClick={revMsgAllReadHandler}>모두 읽음</button>
                <button type="button" className="el_btnS el_btn8Back hp_ml5" onClick={revMsgClearHandler}>비우기</button>
            </td>
        </tr>
    );
}

export default RevSetting;
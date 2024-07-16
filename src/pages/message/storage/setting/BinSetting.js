import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callBinMsgListAPI } from "../../../../apis/MessageAPICalls";

function BinSetting() {
    const dispatch = useDispatch();
    const binMessages = useSelector(state => state.messageReducer.binMessage.message);

    useEffect(() => {
        dispatch(callBinMsgListAPI());
    }, [dispatch]);

    return (
        <tr>
            <th scope="row" rowSpan={3}>휴지통</th>
            <td>휴지통</td>
            <td>0/{binMessages && binMessages.length}</td>
            <td>
                <button type="button" className="el_btnS el_btn8Back hp_ml5">비우기</button>
            </td>
        </tr>
    );
}

export default BinSetting;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { callSendDetailAPI, callGetAttachListAPI, callMoveToRevAPI, callMoveToImpAPI, callMoveToWorkAPI } from "../../../../apis/MessageAPICalls";

function BinDetail() {

    const { msgCode } = useParams();    // URL에서 msgCode 추출
    const dispatch = useDispatch();     
    const msgDetail = useSelector(state => state.messageReducer.messageDetail);
    const navigate = useNavigate();

    const attachmentList = useSelector(state => state.messageReducer.attachments);

    useEffect(() => {
        
        const sendMsgDetail = async () => {
            try {
                await dispatch(callSendDetailAPI(msgCode));
            } catch (error) {
                console.log("error : ", error);
            }
        };
        
        const attachList = async () => {
            try {
                await dispatch(callGetAttachListAPI(msgCode));
            } catch (error) {
                console.log("attach error : ", error);
            }
        };

        sendMsgDetail();
        attachList();

    }, [dispatch, msgCode]);

    const DeleteHandler = async () => {
        
        try {
            const result = await fetch(`http://localhost:8080/emp/message/bin/${msgCode}`, {
                method: 'DELETE'
            });
            
            if (!result.ok) {
                throw new Error("완전 삭제 실패");
            } 
            
            alert("쪽지를 삭제하였습니다.");
            navigate('/message/storage/bin');
        } catch (error) {
            console.log('error : ', error);
            alert("쪽지 삭제에 실패하였습니다.");
        }
    };

    if (!msgDetail) {
        return <div>로딩중..</div>;
    }

    /* 날짜 포맷 함수 */
    const formatDateTime = (datetimeString) => {
        const date = new Date(datetimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
    };

    // 파일 다운로드
    const downloadAttach = async (attachOriginal, attachSave) => {
        
        try {
            const url = `http://localhost:8080/emp/message/download?attachOriginal=${encodeURIComponent(attachOriginal)}&attachSave=${encodeURIComponent(attachSave)}`;

            const response = await fetch(url);

            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;

            link.setAttribute('download', attachOriginal);
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(blobUrl);
        } catch(error) {
            console.log("파일 다운로드 error : ", error);
        }
    }    

    /* 쪽지 복원 핸들러 */
    const moveMsgHandler = (e) => {
        const selectOption = e.target.value;

        if (selectOption === "받은 쪽지") {
            moveMsgToRevHandler();

        } else if (selectOption === "중요 보관함") {
            moveMsgToImpHandler();

        } else if (selectOption === "업무 보관함") {
            moveMsgToWorkHandler();
            
        }
    };

    /* 받은 쪽지 */
    const moveMsgToRevHandler = async () => {

        try {
            await dispatch(callMoveToRevAPI(msgCode));
            alert("받은 쪽지로 복원 되었습니다.");
            navigate("/message/storage/bin");
        } catch (error) {
            console.log("받은 쪽지 복원 중 오류 : ", error);
            window.location.reload();
        }
        
    };

    /* 중요 보관함 */
    const moveMsgToImpHandler = async () => {

        try {
            await dispatch(callMoveToImpAPI(msgCode));
            alert("중요 보관함으로 복원 되었습니다.");
            navigate("/message/storage/bin"); 
        } catch (error) {
            console.log("중요 보관함 복원 중 오류 : ", error);
            window.location.reload();
        }

    };

    /* 업무 보관함 */
    const moveMsgToWorkHandler = async () => {

        try {
            await dispatch(callMoveToWorkAPI(msgCode));
            alert("업무 보관함으로 복원 되었습니다.");
            navigate("/message/storage/bin");
        } catch (error) {
            console.log("업무 보관함 복원 중 오류 : ", error);
            window.location.reload();
        }
    };

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">휴지통</h4>
            <section className="bl_sect hp_padding15">
                <table className="bl_tb3">
                    <colgroup>
                        <col style={{width: "120px"}} />
                        <col style={{width:"*"}} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="col">받은사람</th>
                            <td className="hp_alignL">{msgDetail.messageDetail && msgDetail.messageDetail.revName} {msgDetail.messageDetail && msgDetail.messageDetail.revPosition}</td>
                        </tr>
                        <tr>
                            <th scope="col">일자</th>
                            <td className="hp_alignL">{msgDetail.messageDetail && formatDateTime(msgDetail.messageDetail.sendDate)}</td>
                        </tr>
                        <tr>
                            <th scope="col">첨부파일</th>
                            <td className="hp_alignL">
                                {attachmentList.msgCode && attachmentList.msgCode.length > 0 ? (
                                    <ul>
                                        {attachmentList.msgCode.map(attach => (
                                            <li key={attach.attachSave} onClick={() => downloadAttach(attach.attachOriginal, attach.attachSave)}>{attach.attachOriginal}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div>첨부된 파일 없음</div>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="hp_alignL">{msgDetail.messageDetail && msgDetail.messageDetail.msgTitle}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="hp_alignL">{msgDetail.messageDetail && msgDetail.messageDetail.msgCon}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="ly_spaceBetween hp_mt10">
                    <button type="button" className="el_btnS el_btn0Back">읽지않음 처리</button>
                    <div className="">
                        <button type="button" className="el_btnS el_btn8Back hp_mr5" onClick={DeleteHandler}>영구삭제</button>
                        <select className="el_btnS el_btn8Bord hp_mb5" onChange={moveMsgHandler}>
                            <option>복원</option>
                            <option>받은 쪽지</option>
                            <option>중요 보관함</option>
                            <option>업무 보관함</option>
                        </select>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default BinDetail;
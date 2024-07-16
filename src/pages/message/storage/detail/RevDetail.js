import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { callDelMsgAPI, callGetAttachListAPI, callMoveToImpAPI, callMoveToWorkAPI, callRevDetailAPI, callUpdateMsgStatusNrAPI } from "../../../../apis/MessageAPICalls";

function RevDetail() {

    const { msgCode } = useParams();    // URL에서 msgCode 추출
    const dispatch = useDispatch();     
    const msgDetail = useSelector(state => state.messageReducer.messageDetail);
    const navigate = useNavigate();

    const attachmentList = useSelector(state => state.messageReducer.attachments);

    useEffect(() => {
        
        const revMsgDetail = async () => {
            try {
                await dispatch(callRevDetailAPI(msgCode));
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
        
        revMsgDetail();
        attachList();

    }, [dispatch, msgCode]);

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

    /* 답장 핸들러 */
    const replyHandler = () => {
        navigate('/message/storage/deliver', {
            state: {
                empRev: msgDetail.messageDetail.sendName,
                msgTitle: `RE: ${msgDetail.messageDetail.msgTitle}`
            }
        });
    };

    /* 전달 핸들러 */
    const transHandler = () => {
        navigate('/message/storage/deliver', {
            state: {
                msgTitle: `FW: ${msgDetail.messageDetail.msgTitle}`,
                msgCon: `${msgDetail.messageDetail.msgCon}`
            }
        })
    }

    /* 삭제 핸들러 */
    const deleteHandler = async () => {

        try {
            await dispatch(callDelMsgAPI(msgCode));
            alert("쪽지를 삭제했습니다.");
            navigate("/message/storage/receive");
        } catch (error) {
            console.log("삭제 중 오류 : ", error);
            alert("쪽지 삭제에 실패했습니다.");
        }
    };

    // 파일 다운로드
    const downloadAttach = async (attachOriginal, attachSave) => {
        
        try {
            const url = `http://localhost:8080/emp/message/download?attachOriginal=${encodeURIComponent(attachOriginal)}&attachSave=${encodeURIComponent(attachSave)}`;

            const response = await fetch(url);

            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // 파일 다운로드 처리
            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;

            link.setAttribute('download', attachOriginal);
            document.body.appendChild(link);
            link.click();

            // 다운로드 후 URL 해제
            window.URL.revokeObjectURL(blobUrl);
        } catch(error) {
            console.log("파일 다운로드 error : ", error);
        }
    }

    // 보관함 이동 핸들러
    const moveMsgHandler = (e) => {
        const selectOption = e.target.value;
        
        if (selectOption === "중요 보관함") {
            moveMsgToImpHandler();

        } else if (selectOption === "업무 보관함") {
            moveMsgToWorkHandler();
        }
    };

    // 중요 보관함 이동 핸들러
    const moveMsgToImpHandler = async () => {
        try {
            await dispatch(callMoveToImpAPI(msgCode));
            alert("중요 보관함으로 이동 되었습니다.");
            navigate('/message/storage/important');

        } catch (error) {
            console.log("중요 보관함 이동 중 오류 : ", error);
            window.location.reload();
        }
    }

    // 업무 보관함 이동 핸들러
    const moveMsgToWorkHandler = async () => {
        try {
            await dispatch(callMoveToWorkAPI(msgCode));
            alert("업무 보관함으로 이동 되었습니다.");
            navigate('/message/storage/work');

        } catch (error) {
            console.log("업무 보관함 이동 중 오류 : ", error);
            window.location.reload();
        }
        
    }

    // 읽지 않음 처리 핸들러
    const unReadHandler = async () => {
        try {
            await dispatch(callUpdateMsgStatusNrAPI(msgCode));
            alert("읽지 않음 처리 완료");
            navigate('/message/storage/receive');
        } catch (error) {
            console.log("읽지 않음 처리 중 오류 : ", error);
        }
    };

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">받은 쪽지</h4>
            <section className="bl_sect hp_padding15">
                <table className="bl_tb3">
                    <colgroup>
                        <col style={{width: "120px"}} />
                        <col style={{width:"*"}} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="col">보낸사람</th>
                            <td className="hp_alignL">{msgDetail.messageDetail && msgDetail.messageDetail.sendName} {msgDetail.messageDetail && msgDetail.messageDetail.sendPosition}</td>
                        </tr>
                        <tr>
                            <th scope="col">수신일</th>
                            <td className="hp_alignL">{msgDetail.messageDetail && formatDateTime(msgDetail.messageDetail.sendDate)}</td>
                        </tr>
                        <tr>
                            <th scope="col">첨부파일</th>
                            <td className="hp_alignL">
                                {attachmentList.msgCode && attachmentList.msgCode.length > 0 ? (
                                    <ul>
                                        {attachmentList.msgCode.map(attach => (
                                            <li 
                                                key={attach.attachSave} 
                                                onClick={() => downloadAttach(attach.attachOriginal, attach.attachSave)}
                                                style={{ cursor: "pointer"}}
                                            >
                                                {attach.attachOriginal}
                                            </li>
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
                    <button type="button" className="el_btnS el_btn0Back" onClick={unReadHandler}>읽지않음 처리</button>
                    <div className="ly_spaceBetween">
                        <button type="button" className="el_btnS el_btn8Back hp_mr5" onClick={deleteHandler}>삭제</button>
                        <select className="el_btnS el_btn8Bord" onChange={moveMsgHandler}>
                            <option>이동</option>
                            <option>중요 보관함</option>
                            <option>업무 보관함</option>
                        </select>
                        <button type="button" className="el_btnS el_btnblueBord hp_ml5" onClick={transHandler}>전달</button>
                        <button type="button" className="el_btnS el_btnblueBack hp_ml5" onClick={replyHandler}>답장</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default RevDetail;
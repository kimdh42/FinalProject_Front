import {useLocation, useNavigate} from "react-router";
import ViewLine from "./ViewLine";
import ViewDetail from "./ViewDetail";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {
    calldeleteDocumentAPI,
    calldownloadAttachAPI,
    callmodifyStatusAPI,
    callviewAttachAPI,
    callviewLineListAPI
} from "../../../apis/ApprovalAPICalls";
import {useParams} from "react-router-dom";

function ViewMain({}){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const {adCode} = useParams();
    const {document, showBtn} = {...location.state};
    const {viewlines, attaches} = useSelector(state => ({
        viewlines: state.approvalReducer.viewlines,
        attaches: state.approvalReducer.attaches,
    }));

    useEffect(() => {
        adCode && dispatch(callviewLineListAPI(adCode));
    }, [adCode, dispatch]);
    console.log("viewlines", viewlines);

    // talOrder가 0인 값을 제외
    const filteredViewlines = viewlines.filter(item => item.talOrder !== 0);
    const filteredRefers = viewlines.filter(item => item.talOrder === 0);

    const handleCancel = () => {
        if (window.confirm("해당 결재를 상신취소 및 삭제 하시겠습니까?")) {
            dispatch(calldeleteDocumentAPI(adCode))
                .then(() => {navigate("/approval/send/waiting");})
                .catch((error) => {console.error("문서 삭제 실패: ", error);});
        }
    }

    const handleModify = () => {
        if (window.confirm("해당 결재를 상신취소 및 수정 하시겠습니까?\n해당 문서는 임시저장으로 이동됩니다.")) {
            dispatch(callmodifyStatusAPI(adCode))
                .then(() => {navigate(`/approval/form/${document.afCode}`, {state: {parentAdCode: adCode, afName: document.afName}});})
                .catch((error) => {console.log("문서 수정 실패: ", error);});
        }
    }

    useEffect(() => {
        adCode && dispatch(callviewAttachAPI (adCode));
    }, [dispatch, adCode]);

    const handleDownload = (attachSave, attachOriginal) => {
        dispatch(calldownloadAttachAPI(attachOriginal, attachSave));
    }

    console.log("document", document);

    // viewlines 배열에서 talStatus가 "승인" 여부 체크
    const hasNoApproval = viewlines.every(line => line.talStatus !== "승인" && line.talStatus !== "반려");

    const handleCancelClick = () => {navigate(-1);};

    return(
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">{document.afName}</h4>
            {document.talReason &&
                <section className="bl_sect hp_padding15 hp_mb30">
                    <table className="bl_tb3">
                        <colgroup>
                            <col style={{width:'200px'}}/>
                            <col style={{width:'*'}}/>
                        </colgroup>
                        <tbody>
                        <tr>
                            <th scope="col" className="hp_dBack">반려사유</th>
                            <td>{document.talReason}</td>
                        </tr>
                        </tbody>
                    </table>
                </section>}
            <section className="bl_sect hp_padding15">
                <ViewLine document={document} viewlines={filteredViewlines} referlines={filteredRefers} showBtn={showBtn}/>
                <h5 className="hp_fw700 hp_fs18 hp_mb10 hp_mt30">결재정보</h5>
                <table className="bl_tb3 el_approvalTb3__th">
                    <tbody>
                    <tr>
                        <th scope="row">기안양식</th>
                        <td>{document.afName}</td>
                    </tr>
                    <tr>
                        <th scope="row">첨부파일</th>
                        <td colSpan="3">
                            <ul>
                                {attaches && attaches.map((doc, index) => (
                                    <li key={index}>
                                        <button className="el_file__downBtn" onClick={() => handleDownload(doc.attachSave, doc.attachOriginal)} title="다운받기">{doc.attachOriginal}</button>
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">제목</th>
                        <td colSpan="3">{document.adTitle}</td>
                    </tr>
                    </tbody>
                </table>
                <h5 className="hp_fw700 hp_fs18 hp_mb10 hp_mt30">결재내용</h5>
                <ViewDetail afCode={document.afCode} adDetail={document.adDetail}/>
            </section>
            <div className="hp_mt10 hp_alignR">
                <button type="button" className="el_btnS el_btn8Bord" onClick={handleCancelClick}>목록</button>
                {hasNoApproval && (
                    <>
                        <button type="button" className="el_btnS el_btnblueBord hp_ml5" onClick={handleModify}>수정</button>
                        <button type="button" className="el_btnS el_btn8Back hp_ml5" onClick={handleCancel}>삭제</button>
                    </>
                )}
            </div>
        </div>
    )
}
export default ViewMain;
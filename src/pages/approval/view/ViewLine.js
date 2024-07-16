import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {callacceptDocumentAPI, callreturnDocumentAPI, fetchImage} from "../../../apis/ApprovalAPICalls";
import ViewReference from "./ViewReference";

function ViewLine({viewlines, referlines, document={}, showBtn}){
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 서명 이미지 조회
    const [imageData, setImageData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            if (document && document.emp_code) {    // 상신한 사람의 서명 조회
                try {
                    const imageUrl = await fetchImage(document.emp_code);
                    if (imageUrl) setImageData(imageUrl);
                    else setImageData('이미지 없음');
                } catch (error) {
                    console.error('Error fetching image:', error);
                    setImageData('이미지 없음');
                }
            }
        };

        fetchData();
    }, [document.emp_code]);

    // 승인한 사람 서명 조회
    const [imageArr, setImageArr] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 승인, 반려한 사람들의 이미지 조회
                const approvedAndRejectedLines = viewlines.filter(emp => emp.talStatus === "승인" || emp.talStatus === "반려");
                const imageUrls = await Promise.all(approvedAndRejectedLines.map(async (emp) => {
                    try {
                        const imageUrl = await fetchImage(emp.empCode);
                        return imageUrl || null;
                    } catch (error) {
                        console.error('Error fetching image for empCode', emp.empCode, ':', error);
                        return null;
                    }
                }));

                setImageArr(imageUrls);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchData();
    }, [viewlines]);

    // console.log("imageArr", imageArr);

    // 첫번째 미결재인 사람한테 버튼 노출
    const [firstUnapprovedIndex, setFirstUnapprovedIndex] = useState(-1);
    useEffect(() => {
        for (let i = 0; i < viewlines.length; i++) {
            if (viewlines[i].talStatus === "미결재") {
                setFirstUnapprovedIndex(i);
                break;
            }
        }
    }, [viewlines]);

    // console.log("viewlines", viewlines);
    // console.log("document", document);

    // 승인
    const acceptHandler = (index, emp) => {
        let status = "진행중";
        if(index === viewlines.length - 1) status = "완료";
        if(emp.talRole == "전결") status = "전결";

        if (window.confirm("해당 결재를 승인 하시겠습니까?")) {
            document && dispatch(callacceptDocumentAPI({empCode: document.empCode, status, adCode: document.adCode}))
            .then(() => {navigate("/approval/receive/waiting");})
            .catch((error) => {console.error("결재 승인 실패: ", error);});
        }
    }

    // 팝업 표시 상태 관리
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const showRejectPopupHandler = () => {setShowRejectPopup(true);};
    const closeRejectPopupHandler = () => {setShowRejectPopup(false);};

    // 반려 API 호출 함수
    const [rejectReason, setRejectReason] = useState("");

    const handleRejectDocument = () => {
        if (window.confirm("해당 결재를 반려 하시겠습니까?")) {
            document && dispatch(callreturnDocumentAPI({
                empCode: document.empCode,
                adCode: document.adCode,
                talReason: rejectReason // 반려 사유 전달
            })).then(() => {
                navigate("/approval/receive/return");
            }).catch((error) => {
                console.error("결재 반려 실패: ", error);
            });
        }
    };

    return (
        <>
            <div className="ly_spaceBetween hp_mb10">
                <h5 className="hp_fw700 hp_fs18">결재라인</h5>
            </div>
            <div className="ly_flex hp_relative">
                <table className="bl_tb3 hp_alignC hp_w200px ly_fshirnk">
                    <tbody>
                    <tr>
                        <th>구분</th>
                    </tr>
                    <tr>
                        <th>결재상태</th>
                    </tr>
                    <tr>
                        <th>결재일</th>
                    </tr>
                    <tr>
                        <th>소속</th>
                    </tr>
                    <tr>
                        <th>직책</th>
                    </tr>
                    <tr>
                        <th>이름</th>
                    </tr>
                    <tr>
                        <th>서명</th>
                    </tr>
                    </tbody>
                </table>
                <table className="bl_tb3 hp_alignC ly_fgrow1">
                    <tbody>
                    <tr>
                        <th>작성자</th>
                    </tr>
                    <tr>
                        <td><b className="hp_7Color">상신</b></td>
                    </tr>
                    <tr>
                        <td>{document.adReportDate}</td>
                    </tr>
                    <tr>
                        <td>{document.dept_title}</td>
                    </tr>
                    <tr>
                        <td>{document.title_name}</td>
                    </tr>
                    <tr>
                        <td>{document.emp_name}</td>
                    </tr>
                    <tr>
                        <td className="el_approvalSign" style={{ backgroundImage: imageData ? `url(${imageData})` : 'none' }}>
                            <b className="hp_cColor">{(imageData == "이미지 없음") ? "이미지 없음" : ""}</b>
                        </td>
                    </tr>
                    </tbody>
                </table>
                {viewlines.map((emp, index) => {
                    return (
                        <table className="bl_tb3 hp_alignC ly_fgrow1" key={index}>
                            <tbody>
                            <tr>
                                <th>{emp.talRole}자</th>
                            </tr>
                            <tr>
                                <td>{emp.talStatus === '승인' ? (<b className="hp_blueColor">{emp.talStatus}</b>) :
                                emp.talStatus === '반려' ? (<b className="hp_redColor">{emp.talStatus}</b>) :
                                (<b>{emp.talStatus}</b>)}</td>
                            </tr>
                            <tr>
                                <td className="el_approvalSign">{emp.talDate}</td>
                            </tr>
                            <tr>
                                <td>{emp.deptTitle}</td>
                            </tr>
                            <tr>
                                <td>{emp.titleName}</td>
                            </tr>
                            <tr>
                                <td>{emp.empName}</td>
                            </tr>
                            <tr>
                                <td className="el_approvalSign" style={{backgroundImage: emp.talStatus === '승인' || emp.talStatus === '반려' ? `url(${imageArr[index]})` : 'none'}}>
                                <b className="hp_cColor">{(imageArr[index] === "이미지 없음") ? "이미지 없음" : (emp.talStatus === '전결' ? "전결" : "")}</b>
                                    {showBtn && (
                                        <>
                                        {index === firstUnapprovedIndex && (
                                            <>
                                                <button type="button" className="el_btnS el_btnblueBack" onClick={() => acceptHandler(index, emp)}>승인</button>
                                                <button type="button" className="el_btnS el_btn8Back hp_ml5" onClick={showRejectPopupHandler}>반려</button>
                                            </>
                                        )}
                                        </>
                                    )}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    )
                })}
                {showRejectPopup && (
                <div className="bl_popBack bl_rejectPop">
                    <div className="bl_popup hp_w500px">
                        <div className="bl_popWrap bl_profile">
                            <div className="bl_popHead ly_spaceBetween ly_fitemC">
                                <div className="hp_fs18">결재 반려</div>
                                <button type="button" className="bl_popup__closeBtn" onClick={closeRejectPopupHandler}></button>
                            </div>
                            <div className="hp_padding15 hp_alignC">
                                <textarea
                                    placeholder="결재 반려 사유를 입력해 주세요"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                ></textarea>
                                <button type="button" className="el_btnS el_btn8Back hp_mt10" onClick={handleRejectDocument}>반려하기</button>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
            <ViewReference referlines={referlines}/>
        </>
    )
}

export default ViewLine;
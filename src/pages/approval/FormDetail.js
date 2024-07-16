import { useLocation, useNavigate, useParams } from "react-router-dom";
import FormLine from "./FormLine";
import ExceptionWork from "./form/ExceptionWork";
import Overtime from "./form/Overtime";
import Late from "./form/Late";
import Vacation from "./form/Vacation";
import Leave from "./form/Leave";
import Resign from "./form/Resign";
import Apology from "./form/Apology";
import Etc from "./form/Etc";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callApprovalDocRegistAPI, callviewAttachAPI, callviewDetailAPI, callviewInfoAPI } from "../../apis/ApprovalAPICalls";
import {resetAttaches, resetContent, resetOnedoc, resetSuccess} from "../../modules/ApprovalModules";
import {callMyInfoAPI} from "../../apis/EmployeeAPICalls";
import FormReference from "./FormReference";

function FormDetail(){
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const {afName, docInfo, parentAdCode} = {...location.state};
    const {afCode} = useParams();

    const {employee, success, content, attaches, onedoc} = useSelector(state => ({
        employee: state.employeeReducer.employee,
        success: state.approvalReducer.success,
        content: state.approvalReducer.content,
        attaches: state.approvalReducer.attaches,
        onedoc: state.approvalReducer.onedoc,
    }));

    useEffect(() => {
        dispatch(resetContent());
        dispatch(resetOnedoc());
        dispatch(callMyInfoAPI());
    }, [dispatch]);

    useEffect(() => {
        parentAdCode && dispatch(callviewInfoAPI(parentAdCode));
    }, [parentAdCode]);

    console.log("docInfo", docInfo);
    console.log("onedoc", onedoc);

    // 기본값 불러오기
    useEffect(() => {
        if (docInfo){
            setDocument(prev => ({
                ...prev,
                adCode: docInfo.adCode,
                adTitle: docInfo.adTitle,
                adDetail: docInfo.adDetail,
            }));
        }else if (onedoc){
            setDocument(prev => ({
                ...prev,
                adCode: onedoc.adCode,
                adTitle: onedoc.adTitle,
                adDetail: onedoc.adDetail
            }));
        }else{
            setDocument({});
        }
    }, [dispatch, docInfo, onedoc]);

    // content가 안 비워져서 복사용으로 하나더 만듦
    const [cont, setCont] = useState({});

    useEffect(() => {
        if(docInfo){
            dispatch(callviewDetailAPI(docInfo.adDetail));
        }else if(onedoc){
            dispatch(callviewDetailAPI(onedoc.adDetail));
        }
    }, [docInfo, onedoc, dispatch]);

    useEffect(() => {
        if(docInfo || onedoc) setCont(content);
        else setCont({});
    }, [content]);

    console.log("content", content);
    console.log("cont", cont);

    const renderFormCont = () => {
        switch(afCode){
            case '2': return <ExceptionWork handleDetail={handleDetail} formRefs={formRefs} writtenCont={cont} />; break;
            case '3': return <Overtime handleDetail={handleDetail} formRefs={formRefs} writtenCont={cont} />; break;
            case '4': return <Late handleDetail={handleDetail} formRefs={formRefs} writtenCont={cont} />; break;
            case '5': return <Vacation handleDetail={handleDetail} formRefs={formRefs} writtenCont={cont} />; break;
            case '7': return <Leave handleDetail={handleDetail} formRefs={formRefs} writtenCont={cont} />; break;
            case '8': return <Resign handleDetail={handleDetail} formRefs={formRefs} writtenCont={cont} />; break;
            case '9': return <Apology handleDetail={handleDetail} formRefs={formRefs} writtenCont={cont} docInfo={docInfo} />; break;
            default: return <Etc handleDetail={handleDetail} writtenCont={cont}/>; break;
        }
    }

    // 결재 상신
    const [document, setDocument] = useState({});
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];

        employee && setDocument(prev => ({
            ...prev,
            adReportDate: formattedDate,    // 오늘 날짜
            employee: {
                emp_code: employee?.emp_code,
            },
            adStatus: "대기",
            form: {
                afCode: Number(afCode)      // 양식코드
            }
        }));
    }, [afCode, employee]);

    // 제목 전달, document에 추가
    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setDocument(prev => ({
            ...prev,
            [name]: value
        }));
    };

    console.log("document", document);

    // 모달창에서 가져온 인원 배열
    const [trueLineData, setTrueLineData] = useState([]);
    const handleTrueLineList = (data) => {
        setTrueLineData(data);
    };

    // 참조,결재자 전달
    const [referListData, setReferListData] = useState([]);
    const handleReferList = (data) => {
        setReferListData(data);
    };

    // 실결재라인 배열 전달, document에 추가
    useEffect(() => {
        const combinedList = [...referListData, ...trueLineData];
        setDocument(prev => ({
            ...prev,
            trueLineList: combinedList
        }));
    }, [trueLineData, referListData]);

    // 결재상세내용 객체 전달, document에 추가
    const handleDetail = (data) => {
        let key;
        if(afCode == 2 || afCode == 3 || afCode == 4 || afCode == 5) key = "approvalAttendance";
        else if(afCode == 7 || afCode == 8) key = "personal";
        else if(afCode == 1) key = "approvalAppoint";
        else key = "etc";

        setDocument(prev => ({
            ...prev,
            [key]: data
        }));
    };

    // 알림
    useEffect(() => {
        if(success){
            alert("결재문서가 " + success + " 되었습니다.");

            if(success === "임시저장") navigate("/approval/temporary");
            else if(success === "상신") navigate("/approval/send/waiting");

            dispatch(resetSuccess());
            setDocument({});
        }
    }, [success]);


    // 첨부파일 
    const [files, setFiles] = useState([]);

    const handleFileChange = (event) => {
        setFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files)]);
    };

    const handleRemoveFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    // 결재정보 한번에 전달
    const formRefs = useRef({});
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const [temporaryFlag, setTemporaryFlag] = useState(false);

    const onClickApprovalDocRegist = async (temporary) => {
        if (temporary) {
            setTemporaryFlag(true);
            setTriggerUpdate(true);
        } else {
            await performValidationAndSubmit(temporary);
        }
    }

    const performValidationAndSubmit = async (temporary) => {
        // 필수 정보 입력 확인
        const requiredFields = Object.values(formRefs.current);
        let agreeCheckbox = null;

        for (let field of requiredFields) {
            if (field.type === 'checkbox' && field.name === 'agree') {
                agreeCheckbox = field;
                if (!agreeCheckbox.checked) {
                    alert('서약서 동의는 필수입니다.');
                    return;
                }
            } else if (field.hasAttribute('required') && !field.value) {
                field.focus();
                alert('필수 정보를 입력해주세요.');
                return;
            }
        }

        // etc 키가 존재하고, 그 내부의 aeCon 값이 공백이거나 null인지 확인
        if (document.etc && (!document.etc.aeCon || document.etc.aeCon.trim() === '')) {
            alert('내용을 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('document', JSON.stringify(document));

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
            formData.append("attachOriginal", files[i].name);
        }

        await dispatch(callApprovalDocRegistAPI({ formData: formData, temporary: temporary }));
    }

    useEffect(() => {
        if (triggerUpdate) {
            setDocument(prevDocument => ({
                ...prevDocument,
                adStatus: '임시저장'
            }));
            setTriggerUpdate(false);
        }
    }, [triggerUpdate]);

    useEffect(() => {
        if (temporaryFlag) {
            performValidationAndSubmit(true);
            setTemporaryFlag(false);
        }
    }, [document.adStatus]);

    // 첨부파일
    useEffect(() => {
        if (docInfo) dispatch(callviewAttachAPI (docInfo.adCode));
        else if (parentAdCode) dispatch(callviewAttachAPI (parentAdCode));
        else dispatch(resetAttaches());
    }, [dispatch, docInfo]);

    useEffect(() => {
        if (attaches && attaches.length > 0) {
            const filesList = attaches.map(attach => {
                // 파일 경로 조합
                const fileUrl = `${attach.attachUrl}/${attach.attachSave}`;

                // File 객체 생성
                const file = new File([], attach.attachOriginal, {
                    type: attach.type,
                    lastModified: attach.lastModified ? attach.lastModified : Date.now(),
                    name: attach.attachOriginal, // attachOriginal을 name으로 사용
                    url: fileUrl, // 파일의 URL 추가
                });

                // 반환할 객체 구성
                return file;
            });
            setFiles(filesList);
        } else {
            setFiles([]);
        }
    }, [attaches]);


    return(
        <div className="ly_cont">
            {docInfo && docInfo.afName ? <h4 className="el_lv1Head hp_mb30">{docInfo.afName}</h4> : <h4 className="el_lv1Head hp_mb30">{afName}</h4>}
            <section className="bl_sect hp_padding15">
                <FormLine handleTrueLineList={handleTrueLineList} docInfo={docInfo} onedoc={onedoc}/>
                <FormReference handleReferList={handleReferList} docInfo={docInfo} onedoc={onedoc}/>
                <h5 className="hp_fw700 hp_fs18 hp_mb10 hp_mt30">결재정보</h5>
                <table className="bl_tb3 el_approvalTb3__th">
                    <tbody>
                    <tr>
                        <th scope="row">기안양식</th>
                        {docInfo && docInfo.afName ? <td>{docInfo.afName}</td> : <td>{afName}</td>}
                    </tr>
                    <tr>
                        <th scope="row">첨부파일</th>
                        <td colSpan="3">
                            <div className="ly_flex ly_fitemStart">
                                <ul className="hp_w100 hp_mr10">
                                    {files.map((file, index) => (
                                        <li key={index}>
                                            <button type="button" className="hp_mr10 hp_fw700"
                                                    onClick={() => handleRemoveFile(index)} title="삭제">X
                                            </button>
                                            {file.name}
                                        </li>
                                    ))}
                                </ul>
                                <label className="bl_attachBtn__label el_btnS el_btn8Back hp_p3-5">
                                    <input type="file" className="bl_attachBtn__input" multiple
                                           onChange={handleFileChange}/> 파일선택
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">제목</th>
                        <td colSpan="3">
                            <input type="text" className="hp_w100" name="adTitle" value={document.adTitle}
                                   onChange={onChangeHandler} ref={(el) => (formRefs.current['field1'] = el)}
                                   placeholder="[팀명] MM/DD 기안양식명_이름" required/>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <h5 className="hp_fw700 hp_fs18 hp_mb10 hp_mt30">결재내용</h5>
                {renderFormCont()}
            </section>
            <div className="hp_mt10 hp_alignR">
            <button type="button" className="el_btnS el_btnblueBord" onClick={() => onClickApprovalDocRegist(true)}>임시저장</button>
                <button type="button" className="el_btnS el_btnblueBack hp_ml5" onClick={() => onClickApprovalDocRegist(false)}>결재상신</button>
                <button type="button" className="el_btnS el_btn8Back hp_ml5" onClick={() => navigate("/approval/temporary")}>목록</button>
            </div>
        </div>
    )
}
export default FormDetail;
import FormLine from "./FormLine";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {useEffect, useState} from "react";
import {callFormContentAPI, callmodifyFormAPI, callregistFormAPI} from "../../../apis/ApprovalAPICalls";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

function FormView(){
    const {afCode} = useParams();
    const dispatch = useDispatch();
    const formdetail = useSelector(state => state.approvalReducer.formdetail);

    // 뒤로가기
    const navigate = useNavigate();
    const handleCancelClick = () => {navigate(-1);};
    
    // 에디터
    const [editorData, setEditorData] = useState('');
    const handleChange = (event, editor) => {
        const data = editor.getData();
        setEditorData(data);        // 입력받은 내용 에디터에 넣음
        setNewForm(prev => ({
            ...prev,
            afCon: data,
        }));
    };

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setNewForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 최종 전달 정보
    const [newForm, setNewForm] = useState({});
    const handleRegistForm = () => {
        if (window.confirm("새 결재양식을 등록 하시겠습니까?")) {
            dispatch(callregistFormAPI(newForm))
                .then(() => {navigate("/approval/setting/form");})
                .catch((error) => {console.error("결재양식 등록 실패 : ", error);});
        }
    }
    console.log("newForm", newForm);

    // 수정하기 페이지 접근
    useEffect(() => {
        afCode && dispatch(callFormContentAPI(afCode));
    }, [afCode, dispatch]);
    console.log("formdetail", formdetail);

    useEffect(() => {
        if (formdetail && formdetail.afCon !== undefined) setEditorData(formdetail.afCon || '');
    }, [formdetail]);

    useEffect(() => {
        formdetail && setNewForm(prev => ({
            ...prev,
            afName: formdetail.afName,
            afExplain: formdetail.afExplain,
            afCon: formdetail.afCon,
            lineSort: {
                lsCode: formdetail.lsCode
            }
        }));
    }, [formdetail]);


    const handleModifyForm = () => {
        if (window.confirm("해당 결재양식을 수정 하시겠습니까?")) {
            dispatch(callmodifyFormAPI({afCode, newForm}))
                .then(() => {navigate("/approval/setting/form");})
                .catch((error) => {console.error("결재양식 수정 실패 : ", error);});
        }
    }

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">결재양식</h4>
            <section className="bl_sect hp_padding15">
                {formdetail ? (<FormLine setNewForm={setNewForm} parentLsCode={formdetail.lsCode}/>):(<FormLine setNewForm={setNewForm}/>)}
                <h5 className="hp_fw700 hp_fs18 hp_mb10 hp_mt30">기본정보</h5>
                <table className="bl_tb3">
                    <colgroup>
                        <col style={{width: '200px'}}/>
                        <col style={{width: '*'}}/>
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="col">양식명</th>
                        <td><input type="text" className="hp_w100" name="afName" value={newForm?.afName || (formdetail?.afName || '')} onChange={onChangeHandler} placeholder="예외근무신청서"/></td>
                    </tr>
                    <tr>
                        <th scope="col">양식설명</th>
                        <td><input type="text" className="hp_w100" name="afExplain" value={newForm?.afExplain || (formdetail?.afExplain || '')} onChange={onChangeHandler} placeholder="외근, 출장, 교육, 훈련, 재택"/></td>
                    </tr>
                    </tbody>
                </table>
                <h5 className="hp_fw700 hp_fs18 hp_mb10 hp_mt30">결재형식</h5>
                <CKEditor editor={ClassicEditor} data={editorData} onChange={handleChange} />
            </section>
            <div className="hp_mt10 hp_alignR">
                {formdetail && Object.keys(formdetail).length > 0 ? (
                    <button type="button" className="el_btnS el_btnblueBack" onClick={handleModifyForm}>수정</button>
                ): (
                    <button type="button" className="el_btnS el_btnblueBack" onClick={handleRegistForm}>등록</button>
                )}
                <button type="button" className="el_btnS el_btn8Back hp_ml5" onClick={handleCancelClick}>취소</button>
            </div>
        </div>
    )
}

export default FormView;
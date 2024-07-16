import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    callactiveFormAPI, callcheckIsFormAPI,
    calldeleteFormAPI,
    callFormListAPI,
    callnonActiveFormAPI,
    callregistFormAPI
} from "../../../apis/ApprovalAPICalls";
import {useNavigate, useParams} from "react-router-dom";

function Form(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {forms} = useSelector(state => state.approvalReducer);

    useEffect(() => {
        dispatch(callFormListAPI());
    }, []);

    const formCategories = [
        {category: "근태/휴가", data: forms.slice(1, 5)},
        {category: "인사", data: forms.slice(5, 9)},
        {category: "회계", data: forms.slice(9, 11)},
        {category: "기타", data: forms.slice(11)}
    ];

    console.log("forms", forms);

    const [formStatuses, setFormStatuses] = useState({});
    useEffect(() => {
        const fetchFormStatuses = async () => {
            const statuses = {};
            for (const form of forms) {
                if (form.afCode >= 12) {
                    const isFormActive = await dispatch(callcheckIsFormAPI(form.afCode));
                    statuses[form.afCode] = isFormActive;
                }
            }
            setFormStatuses(statuses);
        };

        if (forms.length > 0) {
            fetchFormStatuses();
        }
    }, [forms, dispatch]);




    const handleCancelForm = (afCode) => {
        if (window.confirm("해당 결재양식을 삭제 하시겠습니까?")) {
            dispatch(calldeleteFormAPI(afCode))
                .then(() => {window.location.reload();})
                .catch((error) => {console.error("결재양식 삭제 실패 : ", error);});
        }
    }

    const handleNonActitveForm = (afCode) => {
        if (window.confirm("해당 결재양식을 비활성화 하시겠습니까?")) {
            dispatch(callnonActiveFormAPI(afCode))
                .then(() => {window.location.reload();})
                .catch((error) => {console.error("결재양식 비활성화 실패 : ", error);});
        }
    }

    const handleActitveForm = (afCode) => {
        if (window.confirm("해당 결재양식을 활성화 하시겠습니까?")) {
            dispatch(callactiveFormAPI(afCode))
                .then(() => {window.location.reload();})
                .catch((error) => {console.error("결재양식 활성화 실패 : ", error);});
        }
    }

    return(
        <div className="ly_cont">
            <div className="ly_spaceBetween ly_fitemEnd hp_mb20">
                <h4 className="el_lv1Head">결재양식 관리</h4>
                <a className="el_btnS el_btnblueBack" href="/approval/setting/formView">결재양식 추가</a>
            </div>
            <section className="bl_sect">
                <table className="bl_tb2">
                    <colgroup>
                        <col style={{width: '200px'}}/>
                        <col style={{width: '*'}}/>
                        <col style={{width: '200px'}}/>
                    </colgroup>
                    <thead>
                    <tr>
                        <th scope="row">분류</th>
                        <th scope="row">양식명</th>
                        <th scope="row">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {formCategories.map((category, catIndex) => (
                        category.data.map((form, formIndex) => (
                            <tr key={`${category.category}-${formIndex}`}  style={{ background: form.afActive === "N" ? '#999' : '' }}>
                                {formIndex === 0 && (
                                    <th scope="row" rowSpan={category.data.length}>{category.category}</th>
                                )}
                                <td>{form.afName}
                                    {form.afExplain ? (<b className="hp_7Color hp_ml5">({form.afExplain})</b>) : ''}
                                </td>
                                <td className="hp_alignC">
                                    {form.afCode > 12 ? (
                                        <>
                                            <button type="button" className="el_btnS el_btnblueBord hp_ml5"
                                                    onClick={() => navigate(`/approval/setting/formView/${form.afCode}`)}>수정
                                            </button>
                                            {form.afActive == "Y" ? (
                                                <>
                                                    {formStatuses[form.afCode] ? (
                                                        <button type="button" className="el_btnS el_btn8Bord hp_ml5"
                                                                onClick={() => handleNonActitveForm(form.afCode)}>비활성화
                                                        </button>
                                                    ) : (
                                                        <button type="button" className="el_btnS el_btn8Bord hp_ml5"
                                                                onClick={() => handleCancelForm(form.afCode)}>삭제
                                                        </button>
                                                    )}
                                                </>
                                            ):""}
                                            {form.afActive == "N" ? (
                                                <button type="button" className="el_btnS el_btn8Bord hp_ml5"
                                                        onClick={() => handleActitveForm(form.afCode)}>활성화
                                                </button>
                                            ):""}
                                        </>
                                    ) : ""}
                                </td>
                            </tr>
                        ))
                    ))}
                    </tbody>
                </table>
            </section>
            <ol className="bl_listRing hp_mt30 hp_mb30 hp_7Color">
                <li>기본 제공 양식은 변경할 수 없습니다.</li>
                <li>사용 중인 양식은 삭제는 불가하며, 비활성화 할 수 있습니다.</li>
            </ol>
        </div>
    )
}

export default Form;
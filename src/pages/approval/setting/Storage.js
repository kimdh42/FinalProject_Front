import { useEffect, useState } from "react";
import { callMyInfoAPI } from "../../../apis/EmployeeAPICalls";
import { useDispatch, useSelector } from "react-redux";
import {callboxListAPI,calldeleteBoxAPI,callmodifyBoxAPI,callregistBoxAPI} from "../../../apis/ApprovalAPICalls";

function Storage() {
    const dispatch = useDispatch();
    const { employee, boxes } = useSelector(state => ({
        employee: state.employeeReducer.employee,
        boxes: state.approvalReducer.boxes,
    }));

    // 내정보 조회
    useEffect(() => {
        dispatch(callMyInfoAPI());
    }, [dispatch]);

    // 보관함 조회
    useEffect(() => {
        if (employee.emp_code) dispatch(callboxListAPI(employee.emp_code));
    }, [employee]);

    const [inputFields, setInputFields] = useState([]);

    useEffect(() => {
        setInputFields(boxes.map(form => {
            if (!form.abCode) return null;
            return { ...form };
        }).filter(Boolean)); // Filter out null values, if any
    }, [boxes]);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newInputFields = [...inputFields];
        newInputFields[index][name] = value;
        setInputFields(newInputFields);
    };

    // 삭제
    const handleDelete = (abCode) => {
        console.log("abCode", abCode);
        if (window.confirm("해당 보관함을 삭제 하시겠습니까?\n저장되었던 결재문서는 모두 삭제되며, 원본은 삭제되지 않습니다.\n(원본은 보낸결재함의 완료 메뉴에서 확인하실 수 있습니다.)")) {
            dispatch(calldeleteBoxAPI(abCode))
                .then(() => { window.location.reload(); })
                .catch((error) => { console.error("보관함 삭제 실패: ", error); });
        }
    };

    // 수정
    const handleModify = (abCode) => {
        const modifiedForm = inputFields.find(form => form.abCode === abCode);
        if (modifiedForm) {
            const modifyname = { abName: modifiedForm.abName }; // modifyname 객체를 { "abName": "테스트2" } 형태로 구성
            if (window.confirm("해당 보관함 이름을 수정 하시겠습니까?")) {
                dispatch(callmodifyBoxAPI({abCode: abCode, modifyname: modifyname}))
                    .then(() => { window.location.reload(); })
                    .catch((error) => { console.error("보관함 수정 실패: ", error); });
            }
        }
    };

    // 생성
    const handleCreateBox = (index) => {
        const newBoxName = inputFields[index].abName; // 마지막 inputFields 요소의 abName 가져오기
        if (window.confirm("새 보관함을 생성 하시겠습니까?")) {
            dispatch(callregistBoxAPI({empCode: employee.emp_code, abName: newBoxName}))
                .then(() => { window.location.reload(); })
                .catch((error) => { console.error("보관함 생성 실패: ", error); });
        }
    };

    const handleAddRow = () => {
        setInputFields([...inputFields, { abName: "" }]);
    };

    return (
        <div className="ly_cont">
            <div className="ly_spaceBetween ly_fitemEnd hp_mb20">
                <h4 className="el_lv1Head">개인보관함 관리</h4>
                <button type="button" className="el_btnS el_btnblueBack" onClick={handleAddRow}>+ 추가</button>
            </div>
            <section className="bl_sect">
                <table className="bl_tb2">
                    <colgroup>
                        <col style={{ width: '*' }} />
                        <col style={{ width: '200px' }} />
                    </colgroup>
                    <thead>
                    <tr>
                        <th scope="row">보관함 이름</th>
                        <th scope="row">관리</th>
                    </tr>
                    </thead>
                    <tbody className="hp_alignC">
                    {inputFields.map((form, index) => (
                        <tr key={`"storage"-${index}`}>
                            <td>
                                <input type="text" className="hp_w100" name="abName" value={form.abName}
                                       placeholder="보관함 이름을 입력하세요" onChange={e => handleInputChange(index, e)}/>
                            </td>
                            <td>
                                {index < boxes.length ? (
                                    <>
                                        <button type="button" className="el_btnS el_btnblueBord hp_ml5"
                                                onClick={() => handleModify(form.abCode)}>수정
                                        </button>
                                        <button type="button" className="el_btnS el_btn8Bord hp_ml5"
                                                onClick={() => handleDelete(form.abCode)}>삭제
                                        </button>
                                    </>
                                ) : (
                                    <button type="button" className="el_btnS el_btnblueBord hp_ml5"
                                            onClick={() => handleCreateBox(index)}> 생성 </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {inputFields.length === 0 && (
                        <tr>
                            <td colSpan="2" className="hp_pt50 hp_pb50 hp_7Color">목록이 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default Storage;

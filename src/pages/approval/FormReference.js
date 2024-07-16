import {useEffect, useState} from "react";
import AddressDir2 from "../../components/commons/address/AddressDir2";
import {callviewLineListAPI} from "../../apis/ApprovalAPICalls";
import {useDispatch, useSelector} from "react-redux";
import {resetViewlines} from "../../modules/ApprovalModules";

function FormReference({handleReferList, docInfo = {}, onedoc = {}}){
    const dispatch = useDispatch();
    const {viewlines} = useSelector(state => ({
        viewlines: state.approvalReducer.viewlines,
    }));

    useEffect(() => {
        if(docInfo){
            dispatch(callviewLineListAPI(docInfo.adCode));
        }else if(onedoc){
            dispatch(callviewLineListAPI(onedoc.adCode));
        }else{
            dispatch(resetViewlines());
        }

    }, [docInfo.adCode, onedoc, dispatch]);

    console.log("viewlines", viewlines);

    useEffect(() => {
        const filteredRefers = viewlines
            .filter(item => item.talOrder === 0)
            .map(item => ({
                // ...item,
                emp_code: item.empCode,
                dept_title: item.deptTitle,
                title_name: item.titleName,
                emp_name: item.empName,
                talRole: item.talRole
            }));
        if(docInfo || onedoc) setSelectRefers(filteredRefers);

        // else{
        //     setSelectRefers([]);
        // }
    }, [viewlines]);

    // 모달창 오픈
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // 모달창에서 가져온 인원 배열
    const [selectRefers, setSelectRefers] = useState([]);

    // 확인 버튼 핸들러
    const confirmHandler = (newSelectEmps) => {
        setSelectRefers([]);
        setSelectRefers(prev => {
            const existingEmpCodes = prev.map(emp => emp.emp_code);
            const filteredNewSelectEmps = newSelectEmps.filter(emp => !existingEmpCodes.includes(emp.emp_code));
            return [...prev, ...filteredNewSelectEmps];
        });
        closeModal();
    }

    // 삭제 인원 반영
    const clearReceiver = () => {
        setSelectRefers([]);
    }

    console.log("selectRefers", selectRefers);

    // talRole 변경 핸들러
    const handleRoleChange = (emp_code, newRole) => {
        setSelectRefers((prev) =>
            prev.map((refer) =>
                refer.emp_code === emp_code ? { ...refer, talRole: newRole } : refer
            )
        );
    };

    // 실결재라인 배열 전달
    useEffect(()=>{
        const referList = selectRefers.map((refer, index)=>{
            return {talOrder: 0, talRole: refer.talRole || "참조", employee: {emp_code: refer.emp_code}}
        })
        handleReferList(referList);
    },[selectRefers])

    return(
        <>
            <div className="ly_spaceBetween hp_mb10 hp_mt30">
                <h5 className="hp_fw700 hp_fs18">참조/열람자</h5>
                <button type="button" className="el_btnS el_btn8Bord hp_p3-5" onClick={openModal}>+ 추가</button>
                <AddressDir2 isOpen={isModalOpen} closeModal={closeModal} onConfirm={confirmHandler} onClear={clearReceiver}/>
            </div>
            {selectRefers && selectRefers.length > 0 ? (
                <div className="ly_flex hp_relative">
                    <table className="bl_tb3 hp_alignC hp_w200px ly_fshirnk">
                        <tbody>
                        <tr>
                            <th>구분</th>
                        </tr>
                        <tr>
                            <th>소속 / 직위</th>
                        </tr>
                        <tr>
                            <th>이름</th>
                        </tr>
                        </tbody>
                    </table>
                    {selectRefers.map((refer) => (
                        <table className="bl_tb3 hp_alignC ly_fgrow1" key={refer.emp_code}>
                            <tbody>
                            <tr>
                                <th className="hp_padding0">
                                    <select
                                        className="hp_w100 el_approvalRole__select"
                                        value={refer.talRole || "참조"}
                                        onChange={(e) =>
                                            handleRoleChange(refer.emp_code, e.target.value)
                                        }
                                    >
                                        <option value="참조">참조자</option>
                                        <option value="열람">열람자</option>
                                    </select>
                                </th>
                            </tr>
                            <tr>
                                <td>{refer.dept_title} / {refer.title_name}</td>
                            </tr>
                            <tr>
                                <td>{refer.emp_name}</td>
                            </tr>
                            </tbody>
                        </table>
                    ))}
                </div>
            ) : ""}
        </>
    )
}

export default FormReference;
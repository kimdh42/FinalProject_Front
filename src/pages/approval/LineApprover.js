import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {callLineEmpListAPI, callviewLineListAPI} from "../../apis/ApprovalAPICalls";

function LineApprover({lsCode, lines, employee, handleTrueLineList, docInfo = {}, onedoc = {}, selectEmps}){
    const deptCode = employee.dept_code;
    const titleCode = employee.title_code;
    const dispatch = useDispatch();
    const { lineemps, viewlines } = useSelector(state => ({
        lineemps: state.approvalReducer.lineemps,
        viewlines: state.approvalReducer.viewlines,
    }));

    useEffect(() => {
        if (deptCode && titleCode && lsCode) dispatch(callLineEmpListAPI({ deptCode, titleCode, lsCode }));
    }, [dispatch, deptCode, titleCode, lsCode]);

    useEffect(() => {
        docInfo && dispatch(callviewLineListAPI(docInfo.adCode));
    }, [docInfo.adCode, dispatch]);

    useEffect(() => {
        onedoc && dispatch(callviewLineListAPI(onedoc.adCode));
    }, [onedoc, dispatch]);

    // console.log("viewlines", viewlines);

    useEffect(() => {
        if(viewlines && viewlines.length > 0){
            const filteredViewlines = viewlines.filter(item => item.talOrder !== 0);
            setNewLines(filteredViewlines);
        }
    }, [viewlines]);

    const [newLines, setNewLines] = useState([]);

    // 결재역할 수정 시 반영 (전결은 한명만 설정할 수 있도록 코드 추가 필요)
    const handleRoleChange = (event, empCode) => {
        const updatedRole = event.target.value;

        // 한 명의 전결자만 선택되도록 처리
        if (updatedRole === "전결") {
            const updatedLines = newLines.map(emp =>
                emp.empCode === empCode ? { ...emp, talRole: updatedRole } : { ...emp, talRole: "결재" }
            );
            setNewLines(updatedLines);
        } else {
            setNewLines(prevNewLines =>
                prevNewLines.map(emp =>
                    emp.empCode === empCode ? { ...emp, talRole: updatedRole } : emp
                )
            );
        }
    };

    // selectEmps가 있을 경우
    useEffect(() => {
        if (selectEmps && selectEmps.length > 0) {
            const updatedLines = selectEmps.map((emp, index) => ({
                talOrder: index + 1,
                talRole: "결재",
                deptTitle: emp.dept_title,
                empCode: emp.emp_code,
                empName: emp.emp_name,
                titleName: emp.title_name,
            }));
            setNewLines(updatedLines);
        }else{
            // titleCode 일치여부 확인해서 lines와 lineemps 합쳐서 newArray로 반환
            const newArray = [];
            lineemps.forEach(emp => {
                for (let i = lines.length - 1; i >= 0; i--) {
                    const line = lines[i];
                    const alSortParts = line.alSort.split(', ').filter(part => part.startsWith('T'));
                    if (alSortParts.includes(emp.titleCode)) {
                        const newObj = {...emp, talRole: line.alRole, talOrder: i};
                        newArray.push(newObj);
                        break;
                    }
                }
            });
            // 중복되는 라인 있으면 제거
            const uniqueLineemps = Array.from(new Map(newArray.map(emp => [emp.empCode, emp])).values());
            // 로그인한 사람이 결재라인에 존재하는지 여부
            const targetLine = uniqueLineemps.findIndex(emp => emp.empCode === employee.emp_code);
            // 존재하면 그 다음 값부터 담음
            const resultLineemps = targetLine !== -1 ? uniqueLineemps.slice(targetLine + 1): uniqueLineemps;


            // 최종적으로 값 반환
            setNewLines(resultLineemps);
        }
    }, [selectEmps, lines, lineemps]);

    // 실결재라인 배열 전달
    useEffect(()=>{
        const trueLineList = newLines.map((line, index) => {
            return {talOrder: index + 1, talRole: line.talRole, employee: {emp_code: line.empCode}};
        });
        handleTrueLineList(trueLineList);

    }, [newLines, lines]);

    // console.log("lines", lines);
    // console.log("lineemps", lineemps);
    // console.log("newLines", newLines);

    return (
        <>
            {newLines.map((emp, index) => (
                <table className="bl_tb3 hp_alignC ly_fgrow1" key={index}>
                    <tbody>
                    <tr>
                        <th className="hp_padding0">
                            <select className="hp_w100 el_approvalRole__select" value={emp.talRole}
                                onChange={(event) => handleRoleChange(event, emp.empCode)}>
                                <option value="결재">결재자</option>
                                <option value="전결">전결자</option>
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <td>미결재</td>
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
                        <td className="el_approvalSign"></td>
                    </tr>
                    </tbody>
                </table>
            ))}
        </>
    );
}
export default LineApprover;
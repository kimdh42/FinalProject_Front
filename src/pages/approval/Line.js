import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { callFormLineAPI, fetchImage } from "../../apis/ApprovalAPICalls";
import LineApprover from "./LineApprover";
import {callMyInfoAPI} from "../../apis/EmployeeAPICalls";

function Line({handleTrueLineList, docInfo = {}, onedoc = {}, selectEmps}){
    let myRole = '';

    const navigate = useNavigate();
    const location = useLocation();
    const { lsCode } = { ...location.state };
    const dispatch = useDispatch();

    const { lines, employee } = useSelector(state => ({
        lines: state.approvalReducer.lines,
        employee: state.employeeReducer.employee
    }));

    useEffect(() => {
        dispatch(callMyInfoAPI());
    }, [dispatch]);

    useEffect(() => {
        if(lsCode) dispatch(callFormLineAPI({ lsCode }));
        else if(docInfo && docInfo.lsCode) dispatch(callFormLineAPI({lsCode: docInfo.lsCode}))
    }, [dispatch, lsCode]);

    // 서명 이미지 조회
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (employee.emp_sign) {
                try {
                    const imageUrl = await fetchImage (employee.emp_sign);
                    if (imageUrl) setImageData(imageUrl);
                    else console.error('Failed to fetch image');
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            }
        };

        fetchData();
    }, [employee.emp_sign]);

    return(
        <>
            <table className="bl_tb3 hp_alignC ly_fgrow1">
                <tbody>
                    <tr>
                        <th>
                            {lines.map((line) => {
                                const matchingLine = lines.find(line => line.alSort >= employee.title_code && line.alRole === '전결');
                                myRole = matchingLine ? '(전결자)' : '';
                            })}
                            작성자 {myRole}
                        </th>
                    </tr>
                    <tr>
                        <td><b className="hp_7Color">작성중</b></td>
                    </tr>
                    <tr>
                        <td>{employee.dept_title}</td>
                    </tr>
                    <tr>
                        <td>{employee.title_name}</td>
                    </tr>
                    <tr>
                        <td>{employee.emp_name}</td>
                    </tr>
                    <tr>
                        <td className="el_approvalSign" style={{backgroundImage: imageData ? `url(${imageData})` : 'none'}}></td>
                    </tr>
                </tbody>
            </table>
            <LineApprover lsCode={lsCode} lines={lines} employee={employee} handleTrueLineList={handleTrueLineList} docInfo={docInfo} onedoc={onedoc} selectEmps={selectEmps}/>
        </>
    )
}
export default Line;
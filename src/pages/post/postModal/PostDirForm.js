import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { callGETRoll } from "../postApi/PostAPI";

function PostDirForm({ Roll, LowBoardCode, closeModal, onConfirm, onClear, defaultData }) {
    const dispatch = useDispatch();

    const [originEmp, setOriginEmp] = useState([]);     // 원본 저장
    const [employees, setEmployees] = useState([]);        // 검색 결과 저장
    const [searchType, setSearchType] = useState('전체');   // 기본 검색
    const [searchKeyword, setSearchKeyword] = useState(''); // 검색어

    const [selectEmp, setSelectEmp] = useState([]); // 체크박스로 회원 선택
    const [receiver, setReceiver] = useState([]);   // 받는사람 인원 배열
    const [DefaultData, setDefaultData] = useState([]);   // 받는사람 인원 배열

    const [selectAll, setSelectAll] = useState(false);

    const RollState = useSelector(state => state.post.RollState);
    useEffect(() => {
        // console.log("RollState", RollState)
        setReceiver(RollState)
        // console.log(RollState)
        // console.log(receiver)

    }, [RollState])
    useEffect(() => {
        if (defaultData && defaultData.length > 0) {
            setDefaultData(defaultData);
        }
    }, [defaultData]);

    useEffect(() => {
        if (DefaultData && DefaultData.length > 0) {
            setReceiver(DefaultData);
        }
    }, [DefaultData]);

    useEffect(() => {
        if (receiver && receiver.length > 0) {
            receiverAdd();
        }
    }, [receiver]);

    useEffect(() => {
        // axios로 페이지 로딩 시 데이터 가져오기
        axios.get('http://localhost:8080/address/select')
            .then(res => {
                setOriginEmp(res.data);
                setEmployees(res.data);
            })
            .catch(error => {
                console.log('error : ', error);
            });
    }, []);
    useEffect(() => {
        if (LowBoardCode !== 0){
        dispatch(callGETRoll(LowBoardCode, Roll))
        // console.log(LowBoardCode, Roll)
        }else{
            receiverClear()
        }
    }, [LowBoardCode, Roll])

    // 검색어 입력
    const handleKeywordChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    // 검색 유형 선택
    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
    };

    const handleSearch = () => {
        let employeeFilter = [];

        switch (searchType) {

            // 전체 혹은 해당하는 부서, 이름, 직급 전부 가져오기
            case '전체':
                employeeFilter = originEmp.filter(emp => (emp.dept_title.includes(searchKeyword) || emp.emp_name.includes(searchKeyword) || emp.position_name.includes(searchKeyword)) && !selectEmp.some(selected => selected.emp_code === emp.emp_code));
                break;

            // 부서에 맞는 값 가져오기    
            case '부서':
                employeeFilter = originEmp.filter(emp => emp.dept_title.includes(searchKeyword) && !selectEmp.some(selected => selected.emp_code === emp.emp_code));
                break;

            // 이름에 맞는 값 가져오기
            case '이름':
                employeeFilter = originEmp.filter(emp => emp.emp_name.includes(searchKeyword) && !selectEmp.some(selected => selected.emp_code === emp.emp_code));
                break;

            // 직급에 맞는 값 가져오기    
            case '직급':
                employeeFilter = originEmp.filter(emp => emp.position_name.includes(searchKeyword) && !selectEmp.some(selected => selected.emp_code === emp.emp_code));
                break;

            // 페이지 로딩 시 기본 값
            default:
                employeeFilter = originEmp.filter(emp => !selectEmp.some(selected => selected.emp_code === emp.emp_code));
        }
        setEmployees(employeeFilter);
    }

    // 체크박스 핸들러
    const checkboxChange = (emp) => {
        setSelectEmp(selected =>
            selected.includes(emp) ? selected.filter(e => e !== emp) : [...selected, emp]
        );
    };


    // 받는 사람 영역에 유저 추가
    const receiverAdd = () => {
        if (selectEmp.length > 0) {
            setReceiver(prevReceiver => {
                const empIds = prevReceiver.map(emp => emp.emp_code);
                const newReceivers = selectEmp.filter(emp => !empIds.includes(emp.emp_code));
                return [...prevReceiver, ...newReceivers];
            });

            const updateEmp = employees.filter(emp => !selectEmp.includes(emp));
            setEmployees(updateEmp);
            setSelectEmp([]); // 선택된 직원 초기화
        }
    };

    /* 받는 사람 영역 인원 삭제 */
    const receiverClear = () => {

        setReceiver([]);
        setSelectEmp([]);
        onClear(receiver);
    };



    /* 확인 버튼으로 배열 보내기 */
    const confirmHandle = () => {

        if (receiver === '') {
            alert('인원을 추가해주세요.');
            return;
        }

        onConfirm(receiver)
        console.log("dirForm : ", receiver);
    };


    const toggleAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectEmp([...employees]);
        } else {
            setSelectEmp([]);
        }
    };


    return (
        <>
            <div className="ly_body hp_bordDE hp_margin15 ly_flexC hp_f9Back ly_fdirecCol ly_fitemC"
                style={{ height: 'calc(100% - 20px)', width: '40%' }}>
                <div className="hp_w90 hp_mt20 hp_alignC" style={{ height: '10%' }}>
                    <h4 className="el_lv1Head">주소록</h4>
                    <select className="hp_w100" onChange={handleSearchTypeChange}>
                        <option>전체</option>
                        <option>부서</option>
                        <option>이름</option>
                        <option>직급</option>
                    </select>
                    <div style={{ display: 'flex' }}>
                        <input type="text" className="hp_mt15 hp_floatL" onChange={handleKeywordChange} style={{ width: '60%' }} />
                        <input type="submit" className="el_btnS el_btnblueBord hp_ml5 hp_mt15 hp_floatR" value="검색" onClick={handleSearch} style={{ width: '20%' }} />
                        <button type="button" className="el_btnS el_btn8Bord hp_mt15" onClick={receiverAdd} style={{ marginLeft: '10px', width: '20%' }}>추가</button>
                    </div>
                </div>
                <div className="hp_w90 hp_mt30 hp_mb30 hp_alignC hp_bordDE hp_br5 hp_fBack" style={{ overflow: 'scroll', height: '265px' }}>
                    <table>
                        <thead>
                            <tr>
                                <th><input type="checkbox" checked={selectAll} onChange={toggleAll} /></th>
                                <th style={{ width: '30px' }}>부서</th>
                                <th>이름</th>
                                <th>직급</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* employee 하나씩 꺼내기 */}
                            {employees.map(employee => (
                                <tr key={employee.emp_code}>
                                    <td><input type="checkbox" checked={selectEmp.includes(employee)} onChange={() => checkboxChange(employee)} /></td>
                                    <td onClick={(e) => { e.stopPropagation(); checkboxChange(employee); }}>{employee.dept_title}</td>
                                    <td onClick={(e) => { e.stopPropagation(); checkboxChange(employee); }}>{employee.emp_name}</td>
                                    <td onClick={(e) => { e.stopPropagation(); checkboxChange(employee); }}>{employee.position_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="ly_body hp_bordDE hp_margin15 hp_f9Back ly_flexC hp_f9Back ly_fdirecCol ly_fitemC"
                style={{ height: '473px', width: '60%' }}>
                <div className="hp_w95 hp_h100 hp_alignC hp_bordDE hp_br5 hp_fBack hp_mt30 hp_mb30">
                    <table className="bl_tb3" style={{ height: '400px' }}>
                        <colgroup>
                            <col style={{ width: '120px' }} />
                            <col style={{ width: '*' }} />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">
                                    받는 사람
                                </th>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', height: '12%' }}>
                                        <button type="button" className="el_btnS el_btn8Bord hp_mb10" onClick={receiverClear}>삭제</button>
                                    </div>
                                    <div style={{ width: '250px', height: '88%', overflowY: 'auto', overflowX: 'auto' }}>
                                        {receiver && receiver.length > 0 && (
                                            <>
                                                <ul>
                                                    {receiver.map(emp => (
                                                        <li key={emp.emp_code || emp.empCode}>
                                                            - {emp.emp_name || emp.emp_Name} {'<'}{emp.dept_title || emp.deptTitle} {emp.position_name || emp.positionName}{'>'}
                                                        </li>
                                                    ))}
                                                </ul>

                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="hp_w95 ly_flexEnd hp_pb15" style={{ marginTop: '-20px' }}>
                    <button type="submit" className="el_btnS el_btnblueBack hp_mr5" onClick={confirmHandle}>확인</button>
                    <button type="button" className="el_btnS el_btn8Back" id="closeButton" onClick={closeModal}>취소</button>
                </div>
            </div>
        </>
    );
}

export default PostDirForm;
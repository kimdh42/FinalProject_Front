import { useState, useEffect} from "react";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callDepartmentEmployeesAPI, callResetPasswordAPI } from '../../apis/EmployeeAPICalls';
import PersonalRecordCard from '../employee/PersonalRecordCard';
import Modal from 'react-modal';        // npm install react-modal 설치

Modal.setAppElement('#root');

function EmployeeList(){

    const dispatch = useDispatch();
    const employees = useSelector(state => state.employeeReducer.employees.employees);
    
    console.log('employees in component: ', employees);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmpCode, setSelectedEmpCode] = useState(null);

    useEffect(() => {
        dispatch(callDepartmentEmployeesAPI());
    }, [dispatch]);

    const handleResetPassword = (empCode, e) => {
        e.stopPropagation();
        if (window.confirm('비밀번호를 초기화 하시겠습니까?')) {

            dispatch(callResetPasswordAPI(empCode));
        }
    };

    const openRecordCardModal = (empCode) => {
        console.log('Selected emp_code:', empCode);
        setSelectedEmpCode(empCode);
        setModalOpen(true);
    };

    const closeRecordCardModal = () => {
        setModalOpen(false);
        setSelectedEmpCode(null);
    }

    

         
    return(        
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">팀원정보</h4>
            <div className="ly_spaceBetween">
                <form action="" method="">
                    <input type="text" placeholder="검색어를 입력해주세요" />
                    <input type="submit" className="el_btnS el_btnblueBord hp_ml5" value = "검색" />
                </form>
            </div>
            <section className="bl_sect hp_mt10">
                <table className="bl_tb1">
                    <colgroup>
                        <col style={{width: "50px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                        <col style={{width: "120px"}} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col"><input type="checkbox" Value ="checkAll" /></th>
                            <th scope="col">사번</th>
                            <th scope="col">이름</th>
                            <th scope="col">부서</th>
                            <th scope="col">직급</th>
                            <th scope="col">전화번호</th>
                            <th scope="col">입사날짜</th>
                            <th scope="col">생년월일</th>
                            <th scope="col">비밀번호 초기화</th>
                        </tr>
                    </thead>
                    {/* <!-- 15개씩 나열 --> */}
                    <tbody>
                        {employees && employees.length > 0 ? ( 
                            employees.map(employee => (
                            <tr key={employee.emp_code} onClick={() => openRecordCardModal(employee.emp_code)}>
                                <td scope="row"><input type="checkbox" Value ="checkOne" /></td>
                                <td>{employee.emp_code}</td>
                                <td>{employee.emp_name}</td>
                                <td>{employee.dept_title}</td>
                                <td>{employee.position_name}</td>
                                <td>{employee.phone}</td>
                                <td>{employee.hire_date}</td>
                                <td>{employee.social_security_no}</td>
                                <td>
                                    <button type="button" 
                                            class="el_btnS el_btnblueBack"
                                            onClick={(e) => {
                                                handleResetPassword(employee.emp_code, e)}}
                                    >
                                        초기화
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No employees found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
            <div className="ly_spaceBetween ly_fitemC hp_mt10">
                <div className="hp_ml10 hp_7Color">총 1 / <b className="hp_0Color hp_fw700">1</b> 페이지</div>
                <select>
                    <option Value ="">정렬방식</option>
                </select>
            </div>
            <section className="bl_sect hp_mt10 hp_padding5" style={{ textAlign: 'center' }}>
                <div className="bl_paging">
                    <a className="bl_paging__btn bl_paging__first" href="" title="첫 페이지로 이동"></a>
                    <a className="bl_paging__btn bl_paging__prev" href="" title="이전 페이지로 이동"></a>
                    <a className="bl_paging__btn bl_paging__num" href="">1</a>
                    <a className="bl_paging__btn bl_paging__next" href="" title="다음 페이지로 이동"></a>
                    <a className="bl_paging__btn bl_paging__last" href="" title="마지막 페이지로 이동"></a>
                </div>
            </section>
            <Modal isOpen={modalOpen} onRequestClose={closeRecordCardModal} contentLabel="Employee Record Card">
                    <button onClick={closeRecordCardModal}>✖</button>
                    <PersonalRecordCard empCode={selectedEmpCode} />
            </Modal>
        </div>
    )
}
export default EmployeeList;
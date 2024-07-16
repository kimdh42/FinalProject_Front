import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callDepartmentsAPI, callRegistDeptAPI } from '../../apis/EmployeeAPICalls';
import DepartmentTree from './DepartmentTree';

function DeptManagerMent() {
    const dispatch = useDispatch();
    const deptDetail = useSelector(state => state.employeeReducer.deptDetail);
    
    const [addNewDept, setAddNewDept] = useState(false);
    const [newDeptTitle, setNewDeptTitle] = useState('');

    useEffect(() => {
        dispatch(callDepartmentsAPI());
    }, [dispatch]);

    const renderDepartmentDetail = () => {
        if (!deptDetail) {
            return <div>부서 정보를 가져오는 중입니다...</div>;
        }

        const { departmentList } = deptDetail;
        if (!departmentList || departmentList.length === 0) {
            return;
        }

        const department = departmentList[0];

        return (
            <table className="bl_tb3">
                <colgroup>
                    <col style={{ width: "120px" }} />
                    <col style={{ width: "*" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">부서코드</th>
                        <td><input type="text" className="hp_w100" value={department.dept_code || ''} readOnly /></td>
                    </tr>
                    <tr>
                        <th scope="row">부서장</th>
                        <td><input type="text" className="hp_w100" value={department.dept_manager_name || department.parentDeptManagerName || ''} readOnly /></td>
                    </tr>
                    <tr>
                        <th scope="row">상위부서</th>
                        <td><input type="text" className="hp_w100" value={(department.par_dept_title && department.par_dept_title.join(', ')) || ''} readOnly /></td>
                    </tr>
                    <tr>
                        <th scope="row">하위부서</th>
                        <td><input type="text" className="hp_w100" value={(department.sub_dept_title && department.sub_dept_title.join(', ')) || ''} readOnly /></td>
                    </tr>
                    <tr>
                        <th scope="row">부서인원수</th>
                        <td><input type="text" className="hp_w100" value={department.numOfTeamMember || ''} readOnly /></td>
                    </tr>
                    <tr>
                        <th scope="row">부서인원</th>
                        <td><input type="text" className="hp_w100" value={(department.teamMemberName && department.teamMemberName.join(', ')) || ''} readOnly /></td>
                    </tr>
                    <tr>
                        <th scope="row">생성일</th>
                        <td><input type="text" className="hp_w100" value={department.creation_date || ''} readOnly /></td>
                    </tr>
                    <tr>
                        <th scope="row">폐쇄일</th>
                        <td><input type="text" className="hp_w100" value={department.end_date || ''} readOnly /></td>
                    </tr>
                </tbody>
            </table>
        );
    };

    const handleAddNewDept = () => {
        setAddNewDept(true);
      };
  
      const handleNewDeptNameChange = (e) => {
        setNewDeptTitle(e.target.value);
      };
  
      const handleNewDeptSubmit = (e) => {
        if (e.key === 'Enter' && newDeptTitle.trim() !== '') {
          dispatch(callRegistDeptAPI(newDeptTitle));
  
          setAddNewDept(false);
          setNewDeptTitle('');
        }
      };

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">부서관리</h4>
            <section className="bl_sect ly_flex" style={{ height: "calc(100% - 30px - 42px)" }}>
                <div className="ly_body hp_bordDE hp_w30 hp_margin15 ly_flexC hp_f9Back ly_fdirecCol ly_fitemC" style={{ height: "calc(100% - 20px)" }}>
                    <div className="hp_w90 hp_mt30" style={{ height: "30%", textAlign: 'center' }}>
                        <select className="hp_w100">
                            <option value="">선택</option>
                        </select>
                        <div className="hp_w100" style={{ height: "30px" }}>
                            <form action="" method="">
                                <input type="text" className="hp_mt15 hp_floatL" style={{ width: "350px" }} id="" name="" value="" placeholder="검색" />
                                <input type="submit" className="el_btnS el_btnblueBord hp_ml5 hp_mt15 hp_floatR" id="" name="" value="검색" />
                            </form>
                        </div>
                        <div className="hp_w100 hp_mt20" style={{ height: "50px" }}>
                            <button type="button" className="el_btnS el_btn0Back hp_mt15 hp_floatR" onClick={handleAddNewDept}>신규조직</button>
                        </div>
                    </div>
                    <div className="hp_w90 hp_mt10 hp_mb30 hp_bordDE hp_br5 hp_fBack" style={{ textAlign: 'left', height: "100%" }}>
                        <DepartmentTree addNewDept={addNewDept} newDeptTitle={newDeptTitle} handleNewDeptNameChange={handleNewDeptNameChange} handleNewDeptSubmit={handleNewDeptSubmit} />
                    </div>
                </div>
                <div className="ly_body hp_bordDE hp_w70 hp_margin15 hp_f9Back ly_flexC hp_f9Back ly_fdirecCol ly_fitemC" style={{ height: "calc(100% - 20px)" }}>
                    <div className="hp_w95 hp_h100 hp_bordDE hp_br5 hp_fBack hp_mt30 hp_mb30" style={{ textAlign: 'center' }}>
                        <h5 className="hp_fw700 hp_fs18 hp_mt15 hp_mb30 hp_floatL hp_ml5">부서정보</h5>
                        {renderDepartmentDetail()}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default DeptManagerMent;

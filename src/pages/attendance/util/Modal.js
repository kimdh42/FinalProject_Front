import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callEmployeeInfoAPI } from '../../../apis/AttendancelAPICalls';

function Modal({ show, handleClose, handleSave }) {
  const dispatch = useDispatch();
  const employeeInfo = useSelector((state) => state.attendanceReducer.employeeInfo);

  useEffect(() => {
    dispatch(callEmployeeInfoAPI());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    labelCode: '', // 상위부서명
    subDepartmentCode: '', // 하위부서명
    teamName: '', // 팀명
    empCode: '', // 사원코드
    startDate: '', // 시작 시간
    endDate: '' // 종료 시간
  });

  const departments = [
    {
      name: '전략기획부',
      subDepartments: [
        { name: '영업부', teams: ['영업기획팀', '고객관리팀'] },
        { name: '마케팅부', teams: ['브랜드관리팀', '디지털마케팅팀'] }
      ]
    },
    {
      name: '경영지원부',
      subDepartments: [
        { name: '인사부', teams: ['채용팀', '교육개발팀'] },
        { name: '정보기술부', teams: ['시스템개발팀', '정보보안팀'] }
      ]
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    // Format data before saving
    const formattedData = {
      ...formData,
      empCode: parseInt(formData.empCode), // Ensure empCode is an integer
      startDate: `${formData.startDate}:00`, // Append seconds
      endDate: `${formData.endDate}:00` // Append seconds
    };
    handleSave(formattedData);
    handleClose();
  };

  const selectedDepartment = departments.find((dep) => dep.name === formData.labelCode);
  const subDepartments = selectedDepartment ? selectedDepartment.subDepartments : [];
  const teams = subDepartments.find((subDep) => subDep.name === formData.subDepartmentCode)?.teams || [];

  if (!show) {
    return null;
  }

  return (
      <div className="bl_popBack active">
        <div className="bl_popup">
          <div className="bl_popWrap hp_w500px">
            <div className="bl_popHead ly_spaceBetween ly_fitemC">
              <div className="hp_fs18">일정</div>
              <button type="button" className="bl_popup__closeBtn" onClick={handleClose}></button>
            </div>
            <div className="hp_padding10">
              <table className="bl_tb3">
                <colgroup>
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '*' }} />
                </colgroup>
                <tbody>
                <tr>
                  <th scope="row">상위부서명</th>
                  <td>
                    <select
                        className="hp_w100"
                        name="labelCode"
                        value={formData.labelCode}
                        onChange={handleChange}
                    >
                      <option value="">선택하세요</option>
                      {departments.map((dep) => (
                          <option key={dep.name} value={dep.name}>
                            {dep.name}
                          </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th scope="row">하위부서명</th>
                  <td>
                    <select
                        className="hp_w100"
                        name="subDepartmentCode"
                        value={formData.subDepartmentCode}
                        onChange={handleChange}
                    >
                      <option value="">선택하세요</option>
                      {subDepartments.map((subDep) => (
                          <option key={subDep.name} value={subDep.name}>
                            {subDep.name}
                          </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th scope="row">팀명</th>
                  <td>
                    <select className="hp_w100" name="teamName" value={formData.teamName} onChange={handleChange}>
                      <option value="">선택하세요</option>
                      {teams.map((team) => (
                          <option key={team} value={team}>
                            {team}
                          </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th scope="row">사원명</th>
                  <td>
                    <select className="hp_w100" name="empCode" value={formData.empCode} onChange={handleChange}>
                      <option value="">선택하세요</option>
                      {employeeInfo.map((emp) => (
                          <option key={emp.emp_code} value={emp.emp_code}>
                            {emp.emp_name}
                          </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th scope="row">시작 시간</th>
                  <td>
                    <input
                        type="datetime-local"
                        className="hp_w100"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th scope="row">종료 시간</th>
                  <td>
                    <input
                        type="datetime-local"
                        className="hp_w100"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                    />
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="hp_alignC hp_mb20 hp_mt10">
              <button type="button" className="el_btnS el_btnblueBack" onClick={handleSubmit}>
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Modal;

import React, { useState, useEffect } from 'react';
import AddressDir from '../../components/commons/address/AddressDir'; // 주소록 모달 컴포넌트 import
import { useSelector } from 'react-redux'; // useSelector 추가
import { request } from '../../apis/api'; // API 호출을 위한 함수 import

function EventModal({ show, handleClose, handleSave: saveEvent }) {
  const { employee } = useSelector((state) => state.employeeReducer); // employee 정보 가져오기
  const [formData, setFormData] = useState({
    title: '',
    endDate: '',
    startDate: '',
    eventGuests: '',
    allDay: false,
    eventCon: '',
    empCode: employee ? employee.empCode : 2020011, // 로그인한 사용자의 empCode로 설정
    labelCode: 1
  });

  // 주소록 모달 오픈/클로즈 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 선택된 참석자 상태 관리
  const [selectEmps, setSelectEmps] = useState([]);

  const confirmHandler = (newSelectEmps) => {
    console.log("New selected employees:", newSelectEmps); // 참석자 데이터 확인 로그
    setSelectEmps(prev => {
      const existingEmpCodes = prev.map(emp => emp.emp_code);
      const filteredNewSelectEmps = newSelectEmps.filter(emp => !existingEmpCodes.includes(emp.emp_code));
      return [...prev, ...filteredNewSelectEmps];
    });
    closeModal();
  };

  const clearReceiver = () => {
    setSelectEmps([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  useEffect(() => {
    console.log("Selected employees state updated:", selectEmps); // 선택된 참석자 상태 업데이트 확인 로그
  }, [selectEmps]);

  const handleSubmit = async () => {
    console.log("handleSubmit called"); // 함수 호출 확인 로그
    const formattedData = {
      ...formData
    };

    console.log("Submitting event data:", formattedData); // 데이터 확인 로그
    const eventResponse = await saveEvent(formattedData);

    console.log("Event Response:", eventResponse);

    // 이벤트 저장 후 참석자 데이터 저장
    if (eventResponse && eventResponse.id) {
      console.log("Selected employees:", selectEmps); // 참석자 데이터 확인 로그

      const token = localStorage.getItem('access-token');
      for (const emp of selectEmps) {
        const guestData = {
          empCode: emp.emp_code,
          eventCode: eventResponse.id
        };
        console.log("Sending guest data:", guestData);

        const guestResponse = await request('POST', '/api/guests', {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }, guestData);
        console.log("Guest Response:", guestResponse);
      }
    } else {
      console.log("Event Response is null or undefined"); // 이벤트 응답이 null 또는 undefined인 경우
    }

    handleClose();
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <div className="bl_popBack">
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
                    <th scope="row">제목</th>
                    <td><input type="text" className="hp_w100" name="title" value={formData.title} onChange={handleChange} /></td>
                  </tr>
                  <tr>
                    <th scope="row">시작 시간</th>
                    <td>
                      <div className="ly_flex">
                        <input type="datetime-local" className="hp_w100" name="startDate" value={formData.startDate} onChange={handleChange} />
                        <label className="hp_w120px"><input type="checkbox" name="allDay" checked={formData.allDay} onChange={handleChange} />종일</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">종료 시간</th>
                    <td>
                      <div className="ly_flex">
                        <input type="datetime-local" className="hp_w100" name="endDate" value={formData.endDate} onChange={handleChange} />
                      </div>
                    </td>
                  </tr>
                  {/* <tr>
                    <th scope="row">라벨 분류</th>
                    <td>
                      <select className="hp_w100" name="labelCode" value={formData.labelCode} onChange={handleChange}>
                        <option value="1">전체</option>
                        <option value="2">부서</option>
                        <option value="3">팀</option>
                        <option value="4">개인</option>
                      </select>
                    </td>
                  </tr> */}
                  <tr>
                    <th scope="row">내용</th>
                    <td><textarea className="hp_w100" placeholder="내용을 입력해주세요" name='eventCon' value={formData.eventCon} onChange={handleChange}></textarea></td>
                  </tr>
                  <tr>
                    <th scope="row">참석자</th>
                    <td>
                      <button type="button" className="el_btnS el_btn8Bord hp_p3-5" onClick={openModal}>참석자 추가 </button>
                      {selectEmps.map((emp, index) => (
                        <span key={emp.emp_code}>
                          {index > 0 && ", "}
                          {emp.emp_name}
                        </span>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="hp_alignC hp_mb20 hp_mt10">
              <button type="button" className="el_btnS el_btnblueBack" onClick={handleSubmit}>저장</button>
            </div>
          </div>
        </div>
      </div>
      <AddressDir isOpen={isModalOpen} closeModal={closeModal} onConfirm={confirmHandler} onClear={clearReceiver}/>
    </>
  );
}

export default EventModal;

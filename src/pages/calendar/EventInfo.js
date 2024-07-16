import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // useSelector import
import { request } from '../../apis/api'; // API 호출을 위한 함수 import
import AddressDir from '../../components/commons/address/AddressDir'; // 주소록 모달 컴포넌트 import

function EventInfo({ show, event, handleClose, handleUpdate, handleDelete }) {
  const { employee } = useSelector((state) => state.employeeReducer); // Redux store에서 employee 정보 가져오기
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    allDay: false,
    eventGuests: '',
    eventCon: '',
    empCode: employee ? employee.empCode : 2020011, // 로그인한 사용자의 empCode로 설정
    labelCode: 1 // Default value
  });

  const [guests, setGuests] = useState([]);
  const [employees, setEmployees] = useState([]); // 사원 목록 상태 추가

  // 주소록 모달 오픈/클로즈 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (event) {
      console.log("Event data received:", event);
      setFormData({
        title: event.title || '',
        startDate: event.start ? formatDateTime(new Date(event.start)) : '',
        endDate: event.end ? formatDateTime(new Date(event.end)) : '',
        allDay: event.allDay || false,
        eventGuests: '',
        eventCon: event.extendedProps?.eventCon || '',
        empCode: event.extendedProps?.empCode || (employee ? employee.empCode : 2020011),
        labelCode: event.extendedProps?.labelCode || 1
      });

      // 참석자 데이터 가져오기
      loadGuests(event.id);
      // 사원 목록 데이터 가져오기
      loadEmployees();
    }
  }, [event, employee]); // employee 추가

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const loadGuests = async (eventId) => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await request('GET', `/api/guests/event/${eventId}`, {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      if (response && response.data) {
        console.log("서버로부터 받은 참석자 데이터:", response.data);
        setGuests(response.data);
      } else {
        console.log("참석자 데이터를 불러오지 못함.");
      }
    } catch (error) {
      console.error('참석자 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const token = localStorage.getItem('access-token');
      const response = await request('GET', '/address/select', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      if (response && response.data) {
        console.log("서버로부터 받은 사원 목록 데이터:", response.data);
        setEmployees(response.data);
      } else {
        console.log("사원 목록 데이터를 불러오지 못함.");
      }
    } catch (error) {
      console.error('사원 목록 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const getEmployeeName = (empCode) => {
    const employee = employees.find(emp => emp.emp_code === empCode);
    return employee ? employee.emp_name : 'Unknown';
  };

  const confirmHandler = (newSelectEmps) => {
    console.log("새 참석자 선택됨:", newSelectEmps);
    setGuests(prev => {
      const existingEmpCodes = prev.map(emp => emp.empCode);
      const filteredNewSelectEmps = newSelectEmps.filter(emp => !existingEmpCodes.includes(emp.emp_code));
      const updatedGuests = [...prev, ...filteredNewSelectEmps.map(emp => ({
        guestCode: null, // 새로운 guestCode는 null로 설정
        empCode: emp.emp_code,
        empName: emp.emp_name, // empName을 추가
        eventCode: event.id // event.id 추가
      }))];
      console.log("업데이트된 참석자 목록:", updatedGuests);
      return updatedGuests;
    });
    closeModal();
  };

  const clearReceiver = () => {
    console.log("참석자 목록 초기화");
    setGuests([]);
  };

  const handleUpdateClick = async () => {
    console.log("Update clicked with form data:", formData);
    await handleUpdate(event.id, formData, guests);
  };

  const handleDeleteClick = async () => {
    console.log("Delete clicked for event ID:", event.id);
    await handleDelete(event.id);
  };

  if (!show || !event) {
    return null;
  }

  const isEventOwner = event.extendedProps.empCode === employee.emp_code;

  console.log("로그인한 사용자", employee.empCode)
  console.log("이벤트 작성자", event.extendedProps.empCode)


  return (
    <>
      <div className="bl_popBack">
        <div className="bl_popup">
          <div className="bl_popWrap hp_w500px">
            <div className="bl_popHead ly_spaceBetween ly_fitemC">
              <div className="hp_fs18">일정 상세</div>
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
                    <td><input type="text" className="hp_w100" name="title" value={formData.title || ''} onChange={handleChange} /></td>
                  </tr>
                  <tr>
                    <th scope="row">시작 시간</th>
                    <td>
                      <div className="ly_flex">
                        <input type="datetime-local" className="hp_w100" name="startDate" value={formData.startDate || ''} onChange={handleChange} />
                        <label className="hp_w120px"><input type="checkbox" name="allDay" checked={formData.allDay} onChange={handleChange} />종일</label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">종료 시간</th>
                    <td>
                      <div className="ly_flex">
                        <input type="datetime-local" className="hp_w100" name="endDate" value={formData.endDate || ''} onChange={handleChange} />
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
                  {isEventOwner && (
                    <tr>
                      <th scope="row">참석자</th>
                      <td>
                        <button type="button" className="el_btnS el_btn8Bord hp_p3-5" onClick={openModal}>참석자 수정 </button>
                        {guests.length > 0 ? guests.map((guest, index) => (
                          <span key={guest.guestCode || `new-${guest.empCode}`}>
                            {index > 0 && ", "}
                            {getEmployeeName(guest.empCode)}
                          </span>
                        )) : <span>참석자가 없습니다</span>}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {isEventOwner && (
              <div className="hp_alignC hp_mb20 hp_mt10">
                <button type="button" className="el_btnS el_btnblueBack" onClick={handleUpdateClick}>수정</button>
                <button type="button" className="el_btnS el_btnredBack" onClick={handleDeleteClick}>삭제</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <AddressDir isOpen={isModalOpen} closeModal={closeModal} onConfirm={confirmHandler} onClear={clearReceiver} />
    </>
  );
}

export default EventInfo;

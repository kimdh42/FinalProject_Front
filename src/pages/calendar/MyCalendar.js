import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callEventsAPI } from '../../apis/CalendarAPICalls';
import { callMyInfoAPI } from '../../apis/EmployeeAPICalls'; // callMyInfoAPI import
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko'; // 한국어 로케일 추가
import EventInfo from './EventInfo';
import EventModal from './EventModal'; // EventModal import
import { request } from '../../apis/api'; // request 함수 import
import "../../css/custom-calendar.css";

const MyCalendar = () => {
  const dispatch = useDispatch();
  const { events, employee } = useSelector((state) => ({
    events: state.calendarReducer.events,
    employee: state.employeeReducer.employee, // 로그인한 사용자 정보 가져오기
  }));

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventInfo, setShowEventInfo] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    dispatch(callEventsAPI());
    dispatch(callMyInfoAPI()); // 로그인한 사용자 정보 가져오기
  }, [dispatch]);

  useEffect(() => {
    if (employee && employee.emp_code) {
      console.log("로그인한 사용자의 empCode:", employee.emp_code);
    }
  }, [employee]);

  useEffect(() => {
    console.log('events 상태:', events);
  }, [events]);

  const handleEventClick = (clickInfo) => {
    const clickedEvent = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      allDay: clickInfo.event.allDay,
      extendedProps: {
        eventCon: clickInfo.event.extendedProps.eventCon,
        eventGuests: clickInfo.event.extendedProps.eventGuests,
        empCode: clickInfo.event.extendedProps.empCode,
        labelCode: clickInfo.event.extendedProps.labelCode,
      },
    };
    console.log("Event clicked:", clickedEvent);
    setSelectedEvent(clickedEvent);
    setShowEventInfo(true);
  };

  const handleDayClick = (selectedDate) => {
    setSelectedDate(selectedDate);
    setShowEventModal(true);
  };

  const handleClose = () => {
    setShowEventInfo(false);
    setShowEventModal(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    const [datePart, timePart] = date.split('T');
    return `${datePart}T${timePart.slice(0, 8)}`; // 초를 제외한 시간 형식으로 변경
  };

  const handleSave = async (formData) => {
    try {
        const formattedData = {
            ...formData,
            startDate: formData.startDate ? formatDateTime(formData.startDate) : null,
            endDate: formData.endDate ? formatDateTime(formData.endDate) : null,
        };
        console.log("Sending event data:", formattedData); // 데이터 확인 로그

        const response = await request('POST', '/calendar/event/regist', {
            'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
            'Content-Type': 'application/json'
        }, formattedData);
        console.log("Server response:", response); // 서버 응답 로그 추가

        if (response && response.data) {
            console.log("Event created successfully:", response.data);
            dispatch(callEventsAPI());
            handleClose();
            return response.data; // 이벤트 생성 후 이벤트 ID를 반환
        } else {
            console.log("No response data received or response is null");
        }
    } catch (error) {
        console.error('Error creating event:', error);
    }
    return null;
};


const handleUpdate = async (id, formData, guests) => {
  try {
      const formattedData = {
          ...formData,
          eventGuests: Array.isArray(formData.eventGuests) ? '' : formData.eventGuests, // eventGuests를 문자열로 변환
          startDate: formData.startDate ? formatDateTime(formData.startDate) : null,
          endDate: formData.endDate ? formatDateTime(formData.endDate) : null,
      };
      console.log("이벤트 업데이트 데이터 전송 중:", JSON.stringify(formattedData, null, 2)); // 데이터를 JSON 형식으로 로그 출력
      const eventResponse = await request('PUT', `/calendar/event/${id}`, {
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
          'Content-Type': 'application/json'
      }, formattedData);
      console.log("이벤트 업데이트 서버 응답:", eventResponse);

      console.log("게스트!",guests)
      // 참석자 데이터 업데이트
      for (const guest of guests) {
          const guestData = {
              empCode: guest.empCode,
              eventCode: id
          };
          if (guest.guestCode) {
              // Update existing guest
              console.log("기존 참석자 업데이트:", guestData);
              await request('PUT', `/api/guests/${guest.guestCode}`, {
                  'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                  'Content-Type': 'application/json'
              }, guestData);
          } else {
              // Add new guest
              console.log("새로운 참석자 추가:", guestData);
              await request('POST', '/api/guests', {
                  'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                  'Content-Type': 'application/json'
              }, guestData);
          }
      }

      dispatch(callEventsAPI());
      handleClose();
  } catch (error) {
      console.error('이벤트 업데이트 중 오류 발생:', error);
  }
};


const handleDelete = async (id) => {
  try {
      await request('DELETE', `/calendar/event/${id}`, {
          'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
          'Content-Type': 'application/json'
      });
      dispatch(callEventsAPI());
      handleClose();
  } catch (error) {
      console.error('Error deleting event:', error);
  }
};


const formattedEvents = events.map((event) => ({
  id: event.id,
  title: event.title,
  start: event.startDate,
  end: event.endDate,
  allDay: event.allDay,
  extendedProps: event.extendedProps // 확장된 속성을 추가
}));


  console.log('Formatted Events:', formattedEvents);

  return (
    <div className="ly_cont">
      <h4 className="el_lv1Head hp_mb30">캘린더</h4>
      <section className="bl_sect" style={{ height: 'calc(100% - 30px - 42px)' }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={koLocale}
          events={formattedEvents} // API로 가져온 이벤트 데이터 설정
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          }}
          editable={true}
          selectable={true}
          eventClick={handleEventClick} // 이벤트 클릭 핸들러
          dateClick={(info) => handleDayClick(info.dateStr)} // 날짜 클릭 핸들러
          // eventDisplay="list-item" // 이벤트 표시 스타일 설정
          dayMaxEventRows={true} // 한 날짜에 표시할 최대 이벤트 수 설정
          dayMaxEvents={2} // 최대 2개의 이벤트만 표시하고 나머지는 더보기(...)로 표시
        />
      </section>
      {showEventInfo && (
        <EventInfo
          show={showEventInfo}
          handleClose={handleClose}
          event={selectedEvent}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      )}
      {showEventModal && (
        <EventModal
          show={showEventModal}
          handleClose={handleClose}
          handleSave={handleSave}
          selectedDate={selectedDate}
          employee={employee}
        />
      )}
    </div>
  );
};

export default MyCalendar;

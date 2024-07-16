import { getEvents } from "../modules/CalendarModules";
import { request } from "./api";

export const callEventsAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/calendar/events', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('API 응답:', result);

            if (result && result.status === 200) {
                // 데이터에 extendedProps 필드를 추가
                const eventsWithExtendedProps = result.data.map(event => ({
                    ...event,
                    extendedProps: {
                        eventCon: event.eventCon,
                        eventGuests: event.eventGuests,
                        empCode: event.empCode,
                        labelCode: event.labelCode
                    }
                }));
                console.log('eventsWithExtendedProps:', eventsWithExtendedProps);
                dispatch(getEvents({ data: eventsWithExtendedProps }));
            } else {
                console.log('이벤트 조회 실패 result : ', result);
            }
        } catch (error) {
            console.log('이벤트 조회 실패 error : ', error);
        }
    };
};


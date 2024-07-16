import { request } from "./api";
import {
    getMyInfo,
    getAttendanceForWeek,
    getAttendanceToday,
    getAttendanceAll,
    getDayOffAll,
    getDayOffBalance,
    getDefaultSchedule,
    getAllAttendanceToday,
    getDocBT,
    getDocBt,
    getDocOw,
    getDocDo,
    getDocMonthDo,
    getEmployeeInfo,
    getAbsentee,
    getBirthEmp,
    getNotice,
    getTask,
    getMsg
} from "../modules/AttendanceModules";
import axios from "axios";

export const callMyInfoAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/employee/myInfo', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callMyInfoAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getMyInfo(result.data));
            } else {
                console.error('내정보 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('내정보 조회 실패 error : ', error);
        }
    };
};

export const callEmployeeInfoAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/employee/alldd', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callEmployeeInfoAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getEmployeeInfo(result.data));
            } else {
                console.error('직원 정보 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('직원 정보 조회 실패 error : ', error);
        }
    };
};

export const callMyAttendanceForWeekAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/my-current-week', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callMyAttendanceForWeekAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getAttendanceForWeek(result.data.results.attendances));
            } else {
                console.error('금주의 근태정보 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('금주의 근태정보 조회 실패:', error);
        }
    };
};

export const callAttendanceTodayAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/today', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callAttendanceTodayAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getAttendanceToday(result.data.results.attendance));
            } else {
                console.error('오늘의 근태정보 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('오늘의 근태정보 조회 실패 error : ', error);
        }
    };
};

export const callAttendanceAllAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/all', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callAttendanceAllAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getAttendanceAll(result.data.results.attendances));
            } else {
                console.error('개인별 전체 근태정보 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('개인별 전체 근태정보 조회 실패 error : ', error);
        }
    };
};

export const callDayOffAllAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/dayOff', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callDayOffAllAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getDayOffAll(result.data.results.dayOffs));
            } else {
                console.error('전체 휴가기록 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('전체 휴가기록 조회 실패 error : ', error);
        }
    };
};

export const callDayOffBalanceAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/my-dayOffBalance', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callDayOffBalanceAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getDayOffBalance(result.data.results.dayOffBalance));
            } else {
                console.error('보유 휴가현황 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('보유 휴가현황 조회 실패 error : ', error);
        }
    };
};

export const callDefaultScheduleAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/allSchedules', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callDefaultScheduleAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getDefaultSchedule(result.data.results.schedules));
            } else {
                console.error('지정 출퇴근시간 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('지정 출퇴근시간 조회 실패 error : ', error);
        }
    };
};

export const callAllAttendanceTodayAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/today-all', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callAttendanceTodayAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getAllAttendanceToday(result.data.results.AllAttendanceToday));
            } else {
                console.error('오늘의 모든 근태정보 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('오늘의 모든 근태정보 조회 실패 error : ', error);
        }
    };
};

export const callDocBTAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/currentBT', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callCurrentBTAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getDocBt(result.data.results.document));
            } else {
                console.error('예외근무 신청 현황 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('error : ', error);
        }
    };
};

export const callDocOWAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/currentOW', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callCurrentOWAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getDocOw(result.data.results.document));
            } else {
                console.error('초과근무 신청 현황 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('error : ', error);
        }
    };
};

export const callDocDOAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/currentDO', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callCurrentOWAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getDocDo(result.data.results.document));
            } else {
                console.error('휴가신청 현황 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('error : ', error);
        }
    };
};

export const callDocMonthDOAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/monthDO', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callMonthDoAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getDocMonthDo(result.data.results.document));
            } else {
                console.error('월간 휴가 승인현황 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('error : ', error);
        }
    };
};

export const callAbsenteeAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/absentee', {
                'Content-Type': 'application/json'
            });

            console.log('부재자 result : ', result);

            if (result && result.status === 200) {
                dispatch(getAbsentee(result.data.results.absentee));
            } else {
                console.error('부재자 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('error : ', error);
        }
    };
};

export const callBirthEmpAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/birth', {
                'Content-Type': 'application/json'
            });

            console.log('callBirthEmpAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getBirthEmp(result.data.employees));
                console.log("디스패치 완료")
            } else {
                console.error('생일자 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('error : ', error);
        }
    };
};

export const callNoticeAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/notice', {
                'Content-Type': 'application/json'
            });

            console.log('공지사항 result : ', result);

            if (result && result.status === 200) {
                dispatch(getNotice(result.data.results.posts));
            } else {
                console.error('업무 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('error : ', error);
        }
    };
};

export const callTaskAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/tasks-b', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callTaskAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getTask(result.data));
            } else {
                console.error('업무 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('error : ', error);
        }
    };
};

export const callMsgAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/api/attendance/message-n', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callTaskAPI result : ', result);

            if (result && result.status === 200) {
                dispatch(getMsg(result.data));
            } else {
                console.error('쪽지 조회 실패 result : ', result);
            }
        } catch (error) {
            console.error('error : ', error);
        }
    };
};
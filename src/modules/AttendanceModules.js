import { createActions, handleActions } from 'redux-actions';

// 초기 상태 정의
const initialState = {
    employee: {},
    attendances: [],
    attendanceToday: null,
    attendanceAll: [],
    dayOffs: [],
    dayOffBalance: {},
    schedules: [],
    AllAttendanceToday: [],
    documentBt: [],
    documentOw: [],
    documentDo: [],
    documentMonthDo: [],
    employeeInfo: [],
    absentee: [],
    birth: [],
    notice: [],
    task: [],
    msg: [],
    profileImg: {},
};

// 액션 타입 정의
const SUCCESS = 'attendance/SUCCESS';
const GET_MY_INFO = 'employee/GET_MY_INFO';
const GET_EMPLOYEE_INFO = 'employee/GET_EMPLOYEE_INFO';
const GET_BIRTH_EMP = 'employee/GET_BIRTH_EMP';
const GET_ATTENDANCE_FOR_WEEK = 'attendance/GET_ATTENDANCE_FOR_WEEK';
const GET_ATTENDANCE_TODAY = 'attendance/GET_ATTENDANCE_TODAY';
const GET_ATTENDANCE_ALL = 'attendance/GET_ATTENDANCE_ALL';
const GET_DAY_OFF_ALL = 'dayOffs/GET_DAY_OFF_ALL';
const GET_DAY_OFF_BALANCE = 'dayOffs/GET_DAY_OFF_BALANCE';
const GET_DEFAULT_SCHEDULE = 'attendance/GET_DEFAULT_SCHEDULE';
const GET_ALL_ATTENDANCE_TODAY = 'attendance/GET_ALL_ATTENDANCE_TODAY';
const GET_DOC_BT = 'documents/GET_DOC_BT';
const GET_DOC_OW = 'documents/GET_DOC_OW';
const GET_DOC_DO = 'documents/GET_DOC_DO';
const GET_DOC_MONTH_DO = 'documents/GET_DOC_MONTH_DO';
const GET_ABSENTEE = 'main/GET_ABSENTEE';
const GET_NOTICE = 'main/GET_NOTICE';
const GET_TASK = 'main/GET_TASK';
const GET_MSG = 'main/GET_MSG';
const GET_PROFILE_IMG = 'employee/GET_PROFILE';

// 액션 함수 생성
export const {
    employee: { getMyInfo, getEmployeeInfo, getBirthEmp, getAttendanceProfileImg },
    attendance: { getAttendanceForWeek, getAttendanceToday, getAttendanceAll, getDefaultSchedule, getAllAttendanceToday },
    dayOffs: { getDayOffAll, getDayOffBalance },
    documents: { getDocBt, getDocOw, getDocDo, getDocMonthDo },
    main: { getAbsentee, getNotice, getTask, getMsg }
} = createActions({
    [SUCCESS]: () => ({ success: true }),
    [GET_MY_INFO]: (employee) => ({ employee }),
    [GET_EMPLOYEE_INFO]: (employeeInfo) => ({ employeeInfo }),
    [GET_BIRTH_EMP]: (birth) => ({ birth }),
    [GET_ATTENDANCE_FOR_WEEK]: (attendances) => ({ attendances }),
    [GET_ATTENDANCE_TODAY]: (attendanceToday) => ({ attendanceToday }),
    [GET_ATTENDANCE_ALL]: (attendanceAll) => ({ attendanceAll }),
    [GET_DAY_OFF_ALL]: (dayOffs) => ({ dayOffs }),
    [GET_DAY_OFF_BALANCE]: (dayOffBalance) => ({ dayOffBalance }),
    [GET_DEFAULT_SCHEDULE]: (schedules) => ({ schedules }),
    [GET_ALL_ATTENDANCE_TODAY]: (AllAttendanceToday) => ({ AllAttendanceToday }),
    [GET_DOC_BT]: (documentBt) => ({ documentBt }),
    [GET_DOC_OW]: (documentOw) => ({ documentOw }),
    [GET_DOC_DO]: (documentDo) => ({ documentDo }),
    [GET_DOC_MONTH_DO]: (documentMonthDo) => ({ documentMonthDo }),
    [GET_ABSENTEE]: (absentee) => ({ absentee }),
    [GET_NOTICE]: (notice) => ({ notice }),
    [GET_TASK]: (task) => ({ task }),
    [GET_MSG]: (msg) => ({ msg }),
    [GET_PROFILE_IMG]: (profileImg) => ({ profileImg }),
});

// 리듀서 정의
const attendanceReducer = handleActions({
    [SUCCESS]: (state, action) => ({
        ...state,
        success: action.payload.success
    }),
    [GET_MY_INFO]: (state, action) => ({
        ...state,
        employee: action.payload.employee
    }),
    [GET_EMPLOYEE_INFO]: (state, action) => ({
        ...state,
        employeeInfo: action.payload.employeeInfo
    }),
    [GET_ATTENDANCE_FOR_WEEK]: (state, action) => ({
        ...state,
        attendances: action.payload.attendances
    }),
    [GET_ATTENDANCE_TODAY]: (state, action) => ({
        ...state,
        attendanceToday: action.payload.attendanceToday
    }),
    [GET_ATTENDANCE_ALL]: (state, action) => ({
        ...state,
        attendanceAll: action.payload.attendanceAll
    }),
    [GET_DAY_OFF_ALL]: (state, action) => ({
        ...state,
        dayOffs: action.payload.dayOffs
    }),
    [GET_DAY_OFF_BALANCE]: (state, action) => ({
        ...state,
        dayOffBalance: action.payload.dayOffBalance
    }),
    [GET_DEFAULT_SCHEDULE]: (state, action) => ({
        ...state,
        schedules: action.payload.schedules
    }),
    [GET_ALL_ATTENDANCE_TODAY]: (state, action) => ({
        ...state,
        AllAttendanceToday: action.payload.AllAttendanceToday
    }),
    [GET_DOC_BT]: (state, action) => ({
        ...state,
        documentBt: action.payload.documentBt
    }),
    [GET_DOC_OW]: (state, action) => ({
        ...state,
        documentOw: action.payload.documentOw
    }),
    [GET_DOC_DO]: (state, action) => ({
        ...state,
        documentDo: action.payload.documentDo
    }),
    [GET_DOC_MONTH_DO]: (state, action) => ({
        ...state,
        documentMonthDo: action.payload.documentMonthDo
    }),
    [GET_ABSENTEE]: (state, action) => ({
        ...state,
        absentee: action.payload.absentee
    }),
    [GET_BIRTH_EMP]: (state, action) => ({
        ...state,
        birth: action.payload.birth
    }),
    [GET_NOTICE]: (state, action) => ({
        ...state,
        notice: action.payload.notice
    }),
    [GET_TASK]: (state, action) => ({
        ...state,
        task: action.payload.task
    }),
    [GET_MSG]: (state, action) => ({
        ...state,
        msg: action.payload.msg
    }),
    [GET_PROFILE_IMG]: (state, action) => ({
        ...state,
        profileImg: action.payload.profileImg
    }),
}, initialState);

export default attendanceReducer;

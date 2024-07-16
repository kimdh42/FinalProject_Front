import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = {
    employees: [],
    employee: {},
    updateEmployee: {},
    registRecordCard: {},
    updateRecordCard: {},
    employeeAll: {},
    recordCard: {},
    departments: [],
    titles: [],
    positions: [],
    deptDetail: {},
    success: {},
    teamRecordCard: {},
    registEmployees: [],
    registEmpList: [],
    registEmpListDetail: [],
    orgChart: [],
    registAppoints: [],
    registAppList: [],
    registAppListDetail: [],
    uploadProfileImg: {},
    profileImg: null,
};

/* 액션 타입 */
const GET_DEPT_EMPLOYEES = 'employee/GET_DEPT_EMPLOYEES';   // 부서인원
const GET_MY_INFO = 'employee/GET_MY_INFO';                 // 내정보 조회
const UPDATE_MY_INFO = 'employee/UPDATE_MY_INFO';
const GET_EMPLOYEE_ALL = 'employee/GET_EMPLOYEE_ALL';
const GET_RECORDCARD = 'employee/GET_RECORDCARD';           // 나의 인사기록카드
const REGIST_MY_RECORDCARD = 'employee/REGIST_MY_RECORDCARD';
const UPDATE_MY_RECORDCARD = 'employee/UPDATE_MY_RECORDCARD';
const GET_DEPARTMENTS = 'employee/GET_DEPARTMENTS';         // 부서 목록
const GET_TITLES = 'employee/GET_TITLES';
const GET_POSITIONS = 'employee/GET_POSITIONS';
const GET_DEPT_DETAIL = 'employee/GET_DEPT_DETAIL';         // 부서 상세정보
const SUCCESS = 'employee/SUCCESS';                         // 등록, 수정, 삭제
const GET_TEAM_RECORDCARD = 'employee/GET_TEAM_RECORDCARD'; // 팀원 인사기록카드
const REGIST_EMPLOYEES = 'employee/REGIST_EMPLOYEES';
const GET_REGIST_EMP_LIST = 'employee/GET_REGIST_EMP_LIST';
const GET_REGIST_EMP_LIST_DETAIL = 'employee/GET_REGIST_EMP_LIST_DETAIL';
const GET_ORG_CHART = 'employee/GET_ORG_CHART';
const REGIST_APPOINTS = 'employee/REGIST_APPOINTS';
const GET_REGIST_APP_LIST = 'employee/GET_REGIST_APP_LIST';
const GET_REGIST_APP_LIST_DETAIL = 'employee/GET_REGIST_APP_LIST_DETAIL';
const UPLOAD_PROFILE_IMG = 'employee/UPLOAD_PROFILE_IMG';
const GET_PROFILE_IMG = 'employee/GET_PROFILE_IMG';

/* 액션 함수 */
export const { employee : { getDeptEmployees, getMyInfo, updateMyInfo, getEmployeeAll, getRecordcard, registMyRecordcard, updateMyRecordcard, getDepartments, getTitles, getPositions, getDeptDetail, success, getTeamRecordcard, registEmployees, getRegistEmpList, getRegistEmpListDetail, getOrgChart, registAppoints, getRegistAppList, getRegistAppListDetail, uploadProfileImg, getProfileImg } } = createActions ({

    [GET_DEPT_EMPLOYEES] : result => {

        console.log('GET_DEPT_EMPLOYEES Action payload:', result);

        return {employees: result};

    },
    [GET_MY_INFO] : result => {

        console.log('GET_MY_INFO Action payload', result);

        return {employee: result};
    },
    [UPDATE_MY_INFO] : result => {

        console.log('UPDATE_MY_INFO Action payload', result);

        return {updateEmployee: result};
    },
    [GET_EMPLOYEE_ALL] : result => {

        console.log('GET_EMPLOYEE_ALL Action payload', result);

        return {employeeAll : result};
    },
    [GET_RECORDCARD] : result => {

        // console.log('GET_RECORDCARD Action payload : ', result);

        return {recordCard: result};
    },
    [REGIST_MY_RECORDCARD] : result => {

        console.log('REGIST_MY_RECORDCARD Action payload', result);

        return {registRecordCard : result};
    },
    [UPDATE_MY_RECORDCARD] : result => {

        console.log('UPDATE_MY_RECORDCARD Action payload', result);

        return { updateRecordCard : result};
    },
    [GET_DEPARTMENTS] : result => {

        console.log('GET_DEPARTMENTS Action payload:', result);

        return {departments: result};

    },
    [GET_TITLES] : result => {
        return {titles: result};
    },

    [GET_POSITIONS] : result => {
        return {positions: result};
    },
    [GET_DEPT_DETAIL] : result => {

        console.log('GET_DEPT_DETAIL Action payload', result);

        return {deptDetail : result};
    },
    [SUCCESS] : result => {

        console.log('SUCCESS Action payload', result);

        return {success : true};
    },
    [GET_TEAM_RECORDCARD] : result => {

        console.log('GET_TEAM_RECORDCARD Action payload', result);

        return {teamRecordCard : result};
    },
    [REGIST_EMPLOYEES] : result => {

        console.log('REGIST_EMPLOYEES Action payload : ', result);

        return { registEmployees : result};
    },
    [GET_REGIST_EMP_LIST] : result => {

        console.log('GET_REGIST_EMP_LIST Action payload : ', result);

        return { registEmpList : result};
    },
    [GET_REGIST_EMP_LIST_DETAIL] : result => {

        console.log('GET_REGIST_EMP_LIST_DETAIL Action payload : ', result);

        return { registEmpListDetail : result };
    },
    [GET_ORG_CHART] : result => {

        console.log('GET_ORG_CHART Action payload : ', result);

        return { orgChart : result};
    },
    [REGIST_APPOINTS] : result => {

        console.log('REGIST_APP Action payload : ', result);

        return { registAppoints : result };
    },
    [GET_REGIST_APP_LIST] : result => {

        console.log('GET_REGIST_APP_LIST Action payload : ', result);

        return { registAppList : result} ;
    },
    [GET_REGIST_APP_LIST_DETAIL] : result => {

        console.log('GET_REGIST_APP_LIST_DETAIL Action payload : ', result);

        return { registAppListDetail : result };
    },
    [UPLOAD_PROFILE_IMG] : result => {

        console.log('UPLOAD_PROFILE_IMG Action payload : ', result);

        return { uploadProfileImg : result };
    },
    [GET_PROFILE_IMG] : result => {

        console.log('GET_PROFILE_IMG Action payload : ', result);

        return { profileImg : result };
    },

});


/* 리듀서 함수 */
const employeeReducer = handleActions({

    [GET_DEPT_EMPLOYEES] : (state, { payload }) => {

        console.log('Reducer GET_DEPT_EMPLOYEES payload: ', payload);

        return {
            ...state,
            employees: payload.employees,

        };
    },
    [GET_MY_INFO] : (state, { payload }) => {

        // 이다정: 주석처리
        // console.log('Reducer GET_MY_INFO payload', payload);

        return {
            ...state,
            employee: payload.employee,
        };
    },
    [UPDATE_MY_INFO] : (state, { payload }) => {

        console.log('Reducer UPDATE_MY_INFO payload', payload);

        return {
            ...state,
            updateEmployee: payload.updateEmployee,
        };
    },
    [GET_EMPLOYEE_ALL] : (state, { payload }) => {

        console.log('Reducer GET_EMPLOYEE_ALL payload : ', payload);

        return {
            ...state,
            employeeAll: payload.employeeAll,
        };
    },
    [GET_RECORDCARD] : ( state, { payload }) => {

        // console.log('Reducer GET_RECORDCARD payload : ', payload);

        return {
            ...state,
            recordCard: payload.recordCard,
        };
    },
    [REGIST_MY_RECORDCARD] : (state, { payload }) => {

        console.log('Reducer REGIST_MY_RECORDCARD payload : ', payload);

        return {
            ...state,
            registRecordCard: payload.registRecordCard,
        };
    },
    [UPDATE_MY_RECORDCARD] : ( state, { payload }) => {

        console.log('Reducer UPDATE_MY_RECORDCARD payload : ', payload);

        return {
            ...state,
            updateRecordCard: payload.updateRecordCard,
        };
    },
    [GET_DEPARTMENTS] : ( state, { payload }) => {

        // console.log('Reducer GET_DEPARTMENS payload:', payload);

        return {
            ...state,
            departments: payload.departments,
        };
    },
    [GET_TITLES] : (state, {payload}) => {
        return {
            ...state,
            titles: payload.titles,
        };
    },

    [GET_POSITIONS] : (state, {payload}) => {
        return {
            ...state,
            positions: payload.positions,
        }
    },
    [GET_DEPT_DETAIL] : ( state, { payload }) => {

        console.log('Reducer GET_DEPT_DETAIL payload : ', payload);

        return {
            ...state,
            deptDetail: payload.deptDetail,
        };
    },
    [SUCCESS] : ( state, { payload }) => {

        console.log('Reducer SUCCESS payload : ', payload);

        return {
            ...state,
            success: payload.success,
        };
    },
    [GET_TEAM_RECORDCARD] : ( state, { payload }) => {

        console.log('Reducer GET_TEAM_RECORDCARD payload : ', payload);

        return {
            ...state,
            teamRecordCard: payload.teamRecordCard,
        };
    },
    [REGIST_EMPLOYEES] : ( state, { payload }) => {

        console.log('Reducer REGIST_EMPLOYEES payload : ', payload);

        return {
            ...state,
            registEmployees: payload.registEmployees,
        };
    },
    [GET_REGIST_EMP_LIST] : ( state, { payload }) => {

        console.log('Reducer GET_REGIST_EMP_LIST payload : ', payload);

        return {
            ...state,
            registEmpList: payload.registEmpList,
        };
    },
    [GET_REGIST_EMP_LIST_DETAIL] : ( state, { payload }) => {

        console.log('Reducer GET_REGIST_EMP_LIST_DETAIL payload : ', payload);

        return {
            ...state,
            registEmpListDetail: payload.registEmpListDetail,
        };
    },
    [GET_ORG_CHART] : ( state, { payload }) => {

        console.log('Reducer GET_ORG_CHART payload : ', payload);

        return {
            ...state,
            orgChart: payload.orgChart,
        };
    },
    [REGIST_APPOINTS] : ( state, { payload }) => {

        console.log('Reducer REGIST_APP payload : ', payload);

        return {
            ...state,
            registAppoints: payload.registAppoints,
        };
    },
    [GET_REGIST_APP_LIST] : ( state, { payload }) => {

        console.log('Reducer GET_REGIST_APP_LIST payload : ', payload);

        return {
            ...state,
            registAppList: payload.registAppList,
        };
    },
    [GET_REGIST_APP_LIST_DETAIL] : ( state, { payload }) => {

        console.log('Reducer GET_REGIST_APP_LIST_DETAIL payload : ', payload);

        return {
            ...state,
            registAppListDetail: payload.registAppListDetail,
        };
    },
    [UPLOAD_PROFILE_IMG] : ( state, { payload }) => {

        console.log('Reducer UPLOAD_PROFILE_IMG payload : ', payload);

        return {
            ...state,
            uploadProfileImg: payload.uploadProfileImg,
        };
    },
    [GET_PROFILE_IMG] : ( state, { payload }) => {

        console.log('Reducer GET_PROFILE_IMG payload : ', payload);

        return {
            ...state,
            profileImg: payload.profileImg,
        };
    },

}, initialState);

export default employeeReducer;
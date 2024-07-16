import { combineReducers } from "redux";
import postReducer from "../pages/post/module/PostReducer";
import approvalReducer from "./ApprovalModules";
import loginReducer from "./LoginModules";
import messageReducer from "./MessageModules";
import calendarReducer from "./CalendarModules";
import employeeReducer from './EmployeeModules';
import attendanceReducer from "./AttendanceModules";

const rootReducer = combineReducers({
    post:postReducer,
    approvalReducer,
    loginReducer,
    messageReducer,
    calendarReducer,
    employeeReducer,
    attendanceReducer
});

export default rootReducer;
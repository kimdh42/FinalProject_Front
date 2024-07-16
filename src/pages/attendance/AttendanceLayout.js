import { Outlet } from "react-router-dom";
import AttendanceNav from "../../components/commons/AttendanceNav";

function AttendanceLayout(){
    return(
        <>
            <AttendanceNav/>
            <Outlet/>
        </>
    )
}
export default AttendanceLayout;
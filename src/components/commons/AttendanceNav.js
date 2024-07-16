import { NavLink } from "react-router-dom";

function AttendanceNav(){
    return(
        <div className="bl_nav">
            <h2 className="bl_nav__ttl">근태 / 휴가</h2>
            <ul className="bl_nav__menu">
                <li>
                    <h3 className="bl_nav__ttlSub">근태</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/attendance/myAttendance">나의 근태현황</NavLink></li>
                        <li><NavLink to="/attendance/attendanceList">상세 근태현황</NavLink></li>
                    </ul>
                </li>
                <li>
                    <h3 className="bl_nav__ttlSub">휴가</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/attendance/myDayOff">나의 휴가현황</NavLink></li>
                        <li><NavLink to="/attendance/dayOffList">상세 휴가현황</NavLink></li>
                    </ul>
                </li>
                <li>
                    <h3 className="bl_nav__ttlSub">환경설정</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/attendance/preferences">근무시간 관리</NavLink></li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}
export default AttendanceNav;
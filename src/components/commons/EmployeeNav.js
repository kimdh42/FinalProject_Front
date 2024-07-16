import { NavLink } from "react-router-dom";

function EmployeeNav(){
    return(
        <div className="bl_nav">
            <h2 className="bl_nav__ttl">인사</h2>
            <ul className="bl_nav__menu">
                <li className="bl_nav__menuSub"><NavLink to="/employee/organization">조직도</NavLink></li>
                <li>
                    <h3 className="bl_nav__ttlSub">인사</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/employee/personalList">인사내역</NavLink></li>
                        <li><NavLink to="/employee/employeeList">팀원정보</NavLink></li>
                    </ul>
                </li>
                <li>
                    <h3 className="bl_nav__ttlSub">발령</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/employee/appointList">발령내역</NavLink></li>
                        <li><NavLink to="/employee/appointRegist">발령등록</NavLink></li>
                    </ul>
                </li>
                <li>
                    <h3 className="bl_nav__ttlSub">환결설정</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/employee/deptManagerMent">부서관리</NavLink></li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}
export default EmployeeNav;
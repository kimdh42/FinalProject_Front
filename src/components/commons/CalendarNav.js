import { NavLink } from "react-router-dom";
import "../../css/schedule.css";

function Calendarnav(){
    return (
        <div className="bl_nav">
            <h2 className="bl_nav__ttl">일정/업무</h2>
            <ul className="bl_nav__menu">
                <li>
                    <h3 className="bl_nav__ttlSub">캘린더</h3>
                    <ul className="bl_nav__menuSub">
                        <li>
                            <NavLink to="/calendar/myCalendar">일정 캘린더</NavLink>
                        </li>
                        {/* 여기에 라벨 체크 박스가 들어가야 함 */}
                        {/* <li>
                            <label className="hp_ml50">
                                <input type="checkbox" className="hp_dpInblock" />
                                <span className="el_scheLabel el_scheLabel__all">전체</span>
                            </label>
                        </li>
                        <li>
                            <label className="hp_ml50">
                                <input type="checkbox" className="hp_dpInblock" />
                                <span className="el_scheLabel el_scheLabel__department">부서</span>
                            </label>
                        </li>
                        <li>
                            <label className="hp_ml50">
                                <input type="checkbox" className="hp_dpInblock" />
                                <span className="el_scheLabel el_scheLabel__team">팀</span>
                            </label>
                        </li>
                        <li>
                            <label className="hp_ml50">
                                <input type="checkbox" className="hp_dpInblock" />
                                <span className="el_scheLabel el_scheLabel__personal">개인</span>
                            </label>
                        </li> */}
                    </ul>
                </li>
                <li>
                    <h3 className="bl_nav__ttlSub">업무</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/calendar/TaskMain">업무 일정</NavLink></li>
                        {/* <li><NavLink to="/approval/setting/sign">업무 보관함(완료)</NavLink></li> */}
                    </ul>
                </li>
                {/* <li>
                    <h3 className="bl_nav__ttlSub">환경설정</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/approval/setting/sign">라벨 관리</NavLink></li>
                    </ul>
                </li> */}
            </ul>
        </div>
    );
}

export default Calendarnav;
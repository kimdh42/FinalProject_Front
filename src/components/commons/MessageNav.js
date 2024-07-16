import { NavLink } from "react-router-dom";

function MessageNav() {
    return (
        <div className="bl_nav">
            <h2 className="bl_nav__ttl">쪽지</h2>
            <ul className="bl_nav__menu">
                <li><NavLink to="/message/storage/deliver" className="bl_nav__ttlSub">쪽지쓰기</NavLink></li>
                <li>
                    <h3 className="bl_nav__ttlSub">보관함</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/message/storage/receive">받은 쪽지</NavLink></li>
                        <li><NavLink to="/message/storage/send">보낸 쪽지</NavLink></li>
                        <li><NavLink to="/message/storage/temp">임시 보관</NavLink></li>
                    </ul>
                </li>
                <li>
                    <h3 className="bl_nav__ttlSub">개인보관함</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/message/storage/important">중요</NavLink></li>
                        <li><NavLink to="/message/storage/work">업무</NavLink></li>
                    </ul>
                </li>
                <li><NavLink className="bl_nav__ttlSub" to="/message/storage/bin">휴지통</NavLink></li>
                <li>
                    <h3 className="bl_nav__ttlSub">환경설정</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/message/storage/setting">보관함 관리</NavLink></li>
                        <li><NavLink to="/message/storage/block">차단 관리</NavLink></li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}
export default MessageNav;
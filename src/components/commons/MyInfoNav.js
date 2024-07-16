import { NavLink } from "react-router-dom";

function MyInfoNav(){
    return(
        <div className="bl_nav">
            <h2 className="bl_nav__ttl">나의 정보</h2>
            <ul className="bl_nav__menu">
                <li className="bl_nav__menuSub"><NavLink to="/myInfo/myInfo">나의 정보</NavLink></li>
                <li className="bl_nav__menuSub"><NavLink to="/myInfo/myPersonalRecordCard">나의 인사기록카드</NavLink></li>
            </ul>
        </div>
    )
}
export default MyInfoNav;
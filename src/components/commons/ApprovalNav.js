import { NavLink } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {callMyInfoAPI} from "../../apis/EmployeeAPICalls";
import {callboxListAPI} from "../../apis/ApprovalAPICalls";

function ApprovalNav(){
    const dispatch = useDispatch();
    const { employee, boxes } = useSelector(state => ({
        employee: state.employeeReducer.employee,
        boxes: state.approvalReducer.boxes,
    }));

    // 내정보 조회
    useEffect(() => {
        dispatch(callMyInfoAPI());
    }, [dispatch]);

    // 보관함 조회
    useEffect(() => {
        if (employee.emp_code) dispatch(callboxListAPI(employee.emp_code));
    }, [employee]);

    // console.log("boxes", boxes);

    // 토글 함수 정의
    const [isSentOpen, setIsSentOpen] = useState(false);
    const [isReceivedOpen, setIsReceivedOpen] = useState(false);
    const [isPersonalBoxOpen, setIsPersonalBoxOpen] = useState(false);
    const toggleSentBox = () => {
        setIsSentOpen(!isSentOpen);
    };

    const toggleReceivedBox = () => {
        setIsReceivedOpen(!isReceivedOpen);
    };

    const togglePersonalBox = () => {
        setIsPersonalBoxOpen(!isPersonalBoxOpen);
    };

    return(
        <div className="bl_nav">
            <h2 className="bl_nav__ttl">전자결재</h2>
            <ul className="bl_nav__menu">
                <li>
                    <h3 className="bl_nav__ttlSub">기안</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/approval/formList">작성하기</NavLink></li>
                        <li><NavLink to="/approval/temporary">임시저장</NavLink></li>
                    </ul>
                </li>
                <li>
                    <h3 className={`bl_nav__ttlSub bl_navToggle__btn ${isSentOpen ? 'bl_navToggle__openBtn' : ''}`} onClick={toggleSentBox}>보낸결재함</h3>
                    <ul className={`bl_nav__menuSub ${isSentOpen ? 'bl_navToggle__openCont' : 'bl_navToggle__closeCont'}`}>
                        <li><NavLink to="/approval/send/waiting">대기</NavLink></li>
                        <li><NavLink to="/approval/send/progress">진행중</NavLink></li>
                        <li><NavLink to="/approval/send/complete">완료</NavLink></li>
                        <li><NavLink to="/approval/send/return">반려</NavLink></li>
                    </ul>
                </li>
                <li>
                    <h3 className={`bl_nav__ttlSub bl_navToggle__btn ${isReceivedOpen ? 'bl_navToggle__openBtn' : ''}`}
                        onClick={toggleReceivedBox}>받은결재함</h3>
                    <ul className={`bl_nav__menuSub ${isReceivedOpen ? 'bl_navToggle__openCont' : 'bl_navToggle__closeCont'}`}>
                        <li><NavLink to="/approval/receive/waiting">대기</NavLink></li>
                        <li><NavLink to="/approval/receive/complete">완료</NavLink></li>
                        <li><NavLink to="/approval/receive/return">반려</NavLink></li>
                        <li><NavLink to="/approval/receive/reference">참조/열람</NavLink></li>
                    </ul>
                </li>
                {boxes && boxes.length > 0 ? (
                    <li>
                        <h3 className={`bl_nav__ttlSub bl_navToggle__btn ${isPersonalBoxOpen ? 'bl_navToggle__openBtn' : ''}`}
                            onClick={togglePersonalBox}>개인보관함</h3>
                        <ul className={`bl_nav__menuSub ${isPersonalBoxOpen ? 'bl_navToggle__openCont' : 'bl_navToggle__closeCont'}`}>
                            {boxes.map((form, index) => (
                                <li key={form.abCode}>
                                    <NavLink to={`/approval/personalBox/${form.abName}`}
                                             state={{abCode: form.abCode}}>{form.abName}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </li>
                ): ''}
                <li>
                    <h3 className="bl_nav__ttlSub">환경설정</h3>
                    <ul className="bl_nav__menuSub">
                        <li><NavLink to="/approval/setting/sign">서명 관리</NavLink></li>
                        <li><NavLink to="/approval/setting/storage">개인보관함 관리</NavLink></li>
                        <li><NavLink to="/approval/setting/form">결재양식 관리</NavLink></li>
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default ApprovalNav;
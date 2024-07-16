import React, { useEffect, useState } from 'react';
import '../css/main.css';
import Header from "../components/commons/Header";
import PheedComponent from "./pheed/PheedComponent";
import { useDispatch, useSelector } from "react-redux";
import {
    callAbsenteeAPI,
    callAttendanceTodayAPI,
    callBirthEmpAPI, callGetAttendanceProfileImgAPI, callMsgAPI,
    callMyInfoAPI,
    callNoticeAPI,
    callTaskAPI,
} from "../apis/AttendancelAPICalls";
import AttendanceSummary from "./attendance/component/AttendanceSummary";
import {callGetProfileImgAPI} from "../apis/EmployeeAPICalls";

function Main() {
    const dispatch = useDispatch();
    const employee = useSelector((state) => state.attendanceReducer.employee);
    const attendancesToday = useSelector((state) => state.attendanceReducer.attendanceToday);
    const absentee = useSelector((state) => state.attendanceReducer.absentee);
    const birthEmp = useSelector((state) => state.attendanceReducer.birth);
    const task = useSelector((state) => state.attendanceReducer.task);
    const msg = useSelector((state) => state.attendanceReducer.msg);
    const notices = useSelector((state) => state.attendanceReducer.notice);
    const profileImg = useSelector(state => state.employeeReducer.profileImg);
    const profileImg2 = useSelector(state => state.attendanceReducer.profileImg);

    useEffect(() => {
        // 필요한 API 호출
        dispatch(callMyInfoAPI());
        dispatch(callAttendanceTodayAPI());
        dispatch(callAbsenteeAPI());
        dispatch(callBirthEmpAPI());
        dispatch(callTaskAPI());
        dispatch(callMsgAPI());
        dispatch(callNoticeAPI());
    }, [dispatch]);

    useEffect(() => {
        if (employee) {
            dispatch(callGetProfileImgAPI(employee.emp_code));
        }
    }, [dispatch, employee]);



    return (
        <>
            <Header />
            <div className="ly_body">
                <div className="ly_cont ly_flex">
                    <div className="ly_flex ly_fdirecCol hp_w400px ly_fshirnk">
                        <section className="bl_sect hp_padding30 el_shadowD4 hp_mb20  bl_mainProfile"
                                 style={{width: '370px', height: '320px'}}>
                            <div className="bl_mainProfile__img"><img className="" src={profileImg}/></div>
                            <ul className="hp_alignC">
                                <li className="hp_fs20 hp_fw700">{employee?.emp_name}</li>
                                <li className="hp_mt20">
                                    <a className="hp_fs16" href="/message/storage/receive">쪽지함 <b
                                        className="bl_mainProfile__alarm">{msg.length}</b></a>
                                    <span className="hp_ml20 hp_mr20 hp_fw700 hp_7Color">|</span>
                                    <a className="hp_fs16" href="/calendar/TaskMain">내 업무 <b
                                        className="bl_mainProfile__alarm">{task.length}</b></a>
                                </li>
                            </ul>
                        </section>
                        <AttendanceSummary attendancesToday={attendancesToday}/>
                        <section className="bl_sect hp_padding30 el_shadowD4" style={{width: '370px'}}>
                            <div className="hp_fw700 hp_mb15 hp_fs18">최신 공지사항</div>
                            <div className="hp_bordTEB">
                                {notices && notices.length > 0 ? (
                                    <table className="table hp_mt15">
                                        <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {notices.slice(0, 3).map((notice) => (
                                            <tr
                                                key={notice.postCode}
                                                style={{height: '30px', cursor: 'pointer'}}
                                                onClick={() => window.location.href = `/post/PostDetail/${notice.postCode}`}
                                            >
                                                <td><b className="hp_fw700">[공지]</b> {notice.postName}</td>
                                                <td className="hp_alignR">{formatNoticeDate(notice.postDate)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>공지사항이 없습니다.</p>
                                )}
                            </div>
                        </section>
                    </div>
                    <div className="ly_fgrow1 hp_ml30" style={{width: '1100px'}}>
                        <PheedComponent/>
                    </div>
                    <div className="hp_ml30 ly_flex ly_fdirecCol hp_w300px ly_fshirnk" style={{height: '800px'}}>
                        <section className="bl_sect el_shadowD4 hp_mb30 hp_h50" style={{padding: '30px'}}>
                            <div className="ly_spaceBetween ly_fitemC">
                                <h5 className="hp_fw700 hp_fs18 hp_mb15">부재자</h5>
                            </div>
                            <div style={{maxHeight: '270px', overflowY: 'auto'}}>
                                <dl className="hp_bordTEB hp_pt10">
                                    {absentee && absentee.length > 0 ? (
                                        absentee.map((person, index) => (
                                            <dd key={index} className="ly_spaceBetween ly_fitemC hp_mt20">
                                                <div className="ly_flex ly_fitemC">
                                                    <ul className="hp_ml10">
                                                        <li>{person.empName}</li>
                                                        <li className="hp_7Color hp_fs13">
                                                            {person.deptTitle || person.subTitle || person.parTitle || "-"}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div
                                                    className={`bl_miniLabel ${getLabelClassName(person.attendanceStatus)}`}>
                                                    {person.attendanceStatus ? person.attendanceStatus.atsName : "-"}
                                                </div>
                                            </dd>
                                        ))
                                    ) : (
                                        <dd>-</dd>
                                    )}
                                </dl>
                            </div>
                        </section>
                        <section className="bl_sect el_shadowD4 hp_mb30 hp_h50" style={{padding: '30px'}}>
                            <div className="ly_spaceBetween ly_fitemC">
                                <h5 className="hp_fw700 hp_fs18 hp_mb10">이달의 생일자</h5>
                            </div>
                            <div style={{maxHeight: '270px', overflowY: 'auto'}}>
                                <dl className="hp_bordTEB hp_pt10">
                                    {birthEmp && birthEmp.length > 0 ? (
                                        birthEmp.map((person, index) => (
                                            <dd key={index} className="ly_spaceBetween ly_fitemC hp_mt20">
                                                <div className="ly_flex ly_fitemC">
                                                    <ul className="hp_ml10">
                                                        <li>{person.emp_name}</li>
                                                        <li className="hp_7Color hp_fs13">
                                                            {person.dept_title || "-"}
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="bl_miniLabel bl_miniLabel__1 hp_mr10">
                                                    {person.social_security_no ? formatDate(person.social_security_no) : "-"}
                                                </div>
                                            </dd>
                                        ))
                                    ) : (
                                        <dd>-</dd>
                                    )}
                                </dl>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}

const formatDate = (dateString) => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
        const [, month, day] = parts;
        const monthFormatted = parseInt(month, 10);
        const dayFormatted = parseInt(day, 10);
        return `${monthFormatted}월 ${dayFormatted}일`;
    } else {
        return dateString;
    }
};

const getLabelClassName = (attendanceStatus) => {
    if (!attendanceStatus) return "";
    switch (attendanceStatus.atsName) {
        case "휴가":
            return "bl_miniLabel__1";
        case "교육":
        case "훈련":
            return "bl_miniLabel__2";
        default:
            return "bl_miniLabel__3";
    }
};

const formatNoticeDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // 월과 일이 한 자리 수인 경우 앞에 0을 붙여줍니다.
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
};

export default Main;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/timeAndAttendance.css';
import MonthWeekComponent from './util/MonthWeekComponent';
import TodayDate2Component from './util/TodayDate2Component';
import {
    callAttendanceTodayAPI,
    callDayOffBalanceAPI, callDocDOAPI, callDocMonthDOAPI,
    callMyAttendanceForWeekAPI,
    callMyInfoAPI
} from '../../apis/AttendancelAPICalls'; // 출퇴근 시간 등록 API import 추가
import WeekAttendance from './component/WeekAttendance';
import MoveButton from "./button/MoveButton";
import AttendanceSummary from "./component/AttendanceSummary";
import DefaultSchedule from "./component/DefaultSchedule";
import TodayDateComponent from "./util/TodayDateComponent";
import CurrentStatus from "./component/CurrentStatus";

function MyDayOff() {
    const dispatch = useDispatch();
    const employee = useSelector((state) => state.attendanceReducer.employee);
    const attendancesToday = useSelector((state) => state.attendanceReducer.attendanceToday);
    const dayOffBalance = useSelector((state) => state.attendanceReducer.dayOffBalance);
    const docMonthDo = useSelector((state) => state.attendanceReducer.documentMonthDo);
    const documentDo = useSelector((state) => state.attendanceReducer.documentDo);


    useEffect(() => {
        dispatch(callMyInfoAPI());
        dispatch(callAttendanceTodayAPI());
        dispatch(callDayOffBalanceAPI());
        dispatch(callDocMonthDOAPI());
        dispatch(callDocDOAPI());
    }, [dispatch]);

    const [showDiv1, setShowDiv1] = useState(true);
    const [isOpenFirst, setIsOpenFirst] = useState(true);
    const [isOpenSecond, setIsOpenSecond] = useState(false);

    const toggleDiv = () => {setShowDiv1(!showDiv1);};
    const toggleFirst = () => {setIsOpenFirst((prev) => !prev);};
    const toggleSecond = () => {setIsOpenSecond((prev) => !prev);};

    return (
        <>
            <div className="ly_cont ly_flex">
                <div className="hp_mr50">
                    <div style={{position: "sticky"}}>
                        <AttendanceSummary attendancesToday={attendancesToday} />
                        <DefaultSchedule employee={employee}/>
                    </div>
                </div>
                <div>
                    <section className="ly_spaceBetween" style={{paddingLeft: '10px'}}>
                        <div className="ly_fitemC hp_mb30" style={{display: 'flex'}}>
                            <div className="ly_flex ly_fitemC">
                                <h4 className="el_lv1Head">나의 휴가 현황</h4>
                            </div>
                        </div>
                    </section>
                    <section
                        className="bl_sect hp_padding40 el_shadowD4 hp_mb20"
                        style={{position: 'relative', width: '900px', zIndex: '2'}}
                    >
                        <div className="hp_fs22 hp_mb30 ly_flex" style={{marginLeft: '230px'}}>
                            <TodayDateComponent/>
                            <div>의 연차 현황입니다.</div>
                        </div>
                        <div className="">
                            <div className="hp_mt30" style={{width: '300px'}}>
                                <table className="ly_fitemC" style={{marginLeft: '190px'}}>
                                    <colgroup>
                                        <col style={{width: "20px"}}/>
                                        <col style={{width: "20px"}}/>
                                        <col style={{width: "20px"}}/>
                                        <col style={{width: "20px"}}/>
                                    </colgroup>
                                    <thead className="">
                                    <tr>
                                        <th>
                                            <div className="bl_tna__label4 hp_lh2-5 hp_mr15 hp_mb15">
                                                <p style={{color: "white"}}>발생연차</p>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="bl_tna__label4 hp_lh2-5 hp_mr15 hp_mb15">
                                                <p style={{color: "white"}}>사용연차</p>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="bl_tna__label4 hp_lh2-5 hp_mr15 hp_mb15">
                                                <p style={{color: "white"}}>잔여연차</p>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="bl_tna__label3 hp_lh2-5 hp_mr15 hp_mb15">
                                                <p style={{color: "#006CD0FF"}}>승인대기</p>
                                            </div>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr className="">
                                        <td>
                                            <div
                                                className="hp_fw700 hp_fs28 ly_flexC hp_mr15">{dayOffBalance ? dayOffBalance.granted : "0"}</div>
                                        </td>
                                        <td>
                                            <div
                                                className="hp_fw700 hp_fs28 ly_flexC hp_mr20">{dayOffBalance ? dayOffBalance.dbUsed : 0}</div>
                                        </td>
                                        <td>
                                            <div
                                                className="hp_fw700 hp_fs28 ly_flexC hp_mr20">{dayOffBalance != null ? dayOffBalance.remaining : 0}</div>
                                        </td>
                                        <td>
                                            <div className="hp_fw700 hp_fs28 ly_flexC hp_mr20">1</div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                    <section>
                        <section
                            className={`bl_sect el_shadowD4 section2_title ${isOpenFirst ? 'go' : ''}`}
                            onClick={toggleFirst}
                        >
                            <div className="ly_flex ly_fitemC">
                                <h4 style={{fontSize: '20px'}}>
                                    <b>🏄‍♂️&nbsp;&nbsp;&nbsp;월간 휴가 승인 현황</b>
                                </h4>
                            </div>
                        </section>
                        <CurrentStatus document={docMonthDo} isOpen={isOpenFirst} toggle={toggleFirst}/>
                    </section>
                    <section>
                        <section
                            className={`bl_sect el_shadowD4 section2_title ${isOpenSecond ? 'go' : ''}`}
                            onClick={toggleSecond}
                        >
                            <div className="ly_flex ly_fitemC">
                                <h4 style={{fontSize: '20px'}}>
                                    <b>🎈&nbsp;&nbsp;&nbsp;휴가 신청 현황</b>
                                </h4>
                            </div>
                        </section>
                        <CurrentStatus document={documentDo} isOpen={isOpenSecond} toggle={toggleSecond}/>

                    </section>
                </div>
                <div className="" style={{paddingLeft: '60px'}}>
                    <section className="bl_sect hp_padding20 el_shadowD4 hp_mb30 section3">
                        <div>
                            <p className="hp_fw700 section3_title">빠른 메뉴</p>
                        </div>
                        <div>
                            <button type="button" className="el_btn0Back el_btnF hp_mt10 section3_btn">
                                출장 신청
                            </button>
                            <button type="button" className="el_btn0Back el_btnF hp_mt10 section3_btn">
                                초과 신청
                            </button>
                            <button type="button" className="el_btn0Back el_btnF hp_mt10 section3_btn">
                                휴가 신청
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default MyDayOff;

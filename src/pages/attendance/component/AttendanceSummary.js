import React from 'react';
import { useSelector } from 'react-redux';
import TodayDateComponent from '../util/TodayDateComponent';
import TimeComponent from '../util/TimeComponent';
import AttendanceButton from '../button/AttendanceButton';

function AttendanceSummary() {
    const attendancesToday = useSelector((state) => state.attendanceReducer.attendanceToday);

    return (
        <section className="bl_sect hp_padding30 el_shadowD4 hp_mb20 section1">
            <div className="hp_fw700"><TodayDateComponent /></div>
            <div className="ly_spaceBetween ly_fitemC hp_mt5">
                <div className="hp_fw700 hp_fs28"><TimeComponent /></div>
                <ul className="hp_alignR">
                    <li className=""><b className="hp_fw700 hp_mr5">출근 시간</b> {attendancesToday?.startTime || '-'}</li>
                    <li className=""><b className="hp_fw700 hp_mr5">퇴근 시간</b> {attendancesToday?.endTime || '-'}</li>
                </ul>
            </div>
            <AttendanceButton attendancesToday={attendancesToday} />
        </section>
    );
}

export default AttendanceSummary;

import React, { useEffect, useState } from 'react';
import '../../../css/timeAndAttendance.css';
import { useDispatch, useSelector } from "react-redux";
import { callMyAttendanceForWeekAPI } from "../../../apis/AttendancelAPICalls";
import WeekWorkHoursCalculator from "./WeekWorkHoursCalculator";
import OverWorkHoursCalculator from "./OverWorkHoursCalculator";

const BarChart = () => {
    const [animate, setAnimate] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(callMyAttendanceForWeekAPI());
        const timeout = setTimeout(() => {
            setAnimate(true);
        }, 100);

        return () => clearTimeout(timeout);
    }, [dispatch]);

    const calculateRegularWorkHours = (attendances) => {
        let regularWorkHoursInSeconds = 0;

        attendances.forEach((attendance) => {
            const { atdDate, atdStartTime, atdEndTime, owStartTime, owEndTime } = attendance;
            const workHours = WeekWorkHoursCalculator({ date: atdDate, startTime: atdStartTime, endTime: atdEndTime, owStartTime, owEndTime }).props.children;

            if (workHours !== "-" && workHours !== "00:00:00") {
                const [hoursStr, minutesStr, secondsStr] = workHours.split(':');
                const hours = parseInt(hoursStr, 10);
                const minutes = parseInt(minutesStr, 10);
                const seconds = parseInt(secondsStr, 10);

                regularWorkHoursInSeconds += hours * 3600 + minutes * 60 + seconds;
            }
        });

        return regularWorkHoursInSeconds;
    };

    const calculateOverWorkHours = (attendances) => {
        let regularWorkHoursInSeconds = 0;

        attendances.forEach((attendance) => {
            const { atdDate, startTime, endTime, owStartTime, owEndTime } = attendance;
            const workHours = OverWorkHoursCalculator({ date: atdDate, startTime, endTime, owStartTime, owEndTime }).props.children;

            if (workHours !== "-" && workHours !== "00:00:00") {
                const [hoursStr, minutesStr, secondsStr] = workHours.split(':');
                const hours = parseInt(hoursStr, 10);
                const minutes = parseInt(minutesStr, 10);
                const seconds = parseInt(secondsStr, 10);

                regularWorkHoursInSeconds += hours * 3600 + minutes * 60 + seconds;
            }
        });

        return regularWorkHoursInSeconds;
    };

    const attendances = useSelector((state) => state.attendanceReducer.attendances);

    const totalHours = 52 * 3600;

    const regularWorkHoursInSeconds = calculateRegularWorkHours(attendances);
    const regularPercent = (regularWorkHoursInSeconds / totalHours) * 100;

    const overWorkHoursInSeconds = calculateOverWorkHours(attendances);
    const overTimePercent = (overWorkHoursInSeconds / totalHours) * 100;

    const totalPercent = ((regularWorkHoursInSeconds + overWorkHoursInSeconds) / totalHours) * 100;

    const regularHours = formatHours(regularWorkHoursInSeconds);
    const overHours = formatHours(overWorkHoursInSeconds);

    return (
        <>
            <div className="hp_fw700 hp_fs32">{formatTime(regularWorkHoursInSeconds + overWorkHoursInSeconds)}</div>
            <div className="hp_mt15" style={{paddingBottom: '5px'}}>
                <div className="stacked-bar-chart">
                    <div className={`cumulative ${animate ? 'animate' : ''}`}
                         style={{width: `${regularPercent}%`}}>
                        {/*<p className="barFont">{regularHours}</p>*/}
                    </div>
                    <div className={`regular ${animate ? 'animate' : ''}`} style={{width: `${totalPercent}%`}}>
                        {/*<p className="barFont">{overHours}</p>*/}
                    </div>
                    <p className="barFont-background">52시간</p>
                </div>
            </div>
            <ul className="hp_mt15">
                <li className="" style={{paddingBottom: '5px'}}>
                    <b className="hp_fw700 hp_mr15">누적 정규 근무</b> {formatTime(regularWorkHoursInSeconds)}
                </li>
                <li className="">
                    <b className="hp_fw700 hp_mr15">누적 초과 근무</b> {formatTime(overWorkHoursInSeconds)}
                </li>
            </ul>
        </>
    );
};

const formatTime = (seconds) => {
    let totalHours = Math.floor(seconds / 3600);
    let remainingSeconds = seconds % 3600;
    let totalMinutes = Math.floor(remainingSeconds / 60);
    let totalSeconds = remainingSeconds % 60;

    return `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;
}

const formatHours = (seconds) => {
    let totalHours = Math.floor(seconds / 3600);  // 전체 시간 계산

    // 시간과 분을 조합하여 문자열로 반환
    return `${totalHours}`;
};

export default BarChart;

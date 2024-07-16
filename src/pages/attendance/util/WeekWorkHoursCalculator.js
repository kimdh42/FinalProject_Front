// util/WeekWorkHoursCalculator.js
import React from 'react';

const WeekWorkHoursCalculator = ({ date, startTime, endTime, owStartTime, owEndTime }) => {
    const calculateWorkHours = (date, startTime, endTime, owStartTime, owEndTime) => {
        if (!startTime || !endTime ||
            startTime === "00:00:00" || endTime === "00:00:00") {
            return "00:00:00";
        }

        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        // 주말인지 확인
        if (start.getDay() === 6 || start.getDay() === 0) {
            return "-";
        }

        // 초과근무 내역이 있다면
        if (owStartTime !== null) {
            const diffMs = end.getTime() - start.getTime() - (60 * 60 * 1000);
            const owStart = new Date(`${date}T${owStartTime}`);
            const result = diffMs - (end.getTime() - owStart.getTime());

            let totalSeconds = Math.floor(result / 1000);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            return formattedTime;
        }

        // 초과근무 내역이 없다면
        const diffMs = end.getTime() - start.getTime() - (60 * 60 * 1000);
        let totalSeconds = Math.floor(diffMs / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        return formattedTime;
    };

    const workHours = calculateWorkHours(date, startTime, endTime, owStartTime, owEndTime);

    return (
        <>
            {workHours}
        </>
    );
};

export default WeekWorkHoursCalculator;

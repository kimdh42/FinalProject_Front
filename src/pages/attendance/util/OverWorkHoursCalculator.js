import React from 'react';

const OverWorkHoursCalculator = ({ date, startTime, endTime, owStartTime, owEndTime }) => {
    const calculateOverWorkHours = (date, startTime, endTime, owStartTime, owEndTime) => {
        if (!date || !startTime || !endTime || !owStartTime || !owEndTime ||
            startTime === "00:00:00" || endTime === "00:00:00" || owStartTime === "00:00:00" || owEndTime === "00:00:00") {
            return "00:00:00";
        }

        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        const owStart = new Date(`${date}T${owStartTime}`);
        const owEnd = new Date(`${date}T${owEndTime}`);

        // 주말 여부 확인
        if (start.getDay() === 6 || start.getDay() === 0) {
            // 주말 계산
            if (owStartTime && owEndTime && owStartTime !== "00:00:00" && owEndTime !== "00:00:00") {
                let totalSeconds;
                if (end > owEnd) {
                    totalSeconds = Math.floor((owEnd.getTime() - owStart.getTime()) / 1000);
                } else {
                    totalSeconds = Math.floor((end.getTime() - owStart.getTime()) / 1000);
                }

                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = totalSeconds % 60;

                // 법정 휴게시간을 포함하여 계산
                if (hours >= 4 && hours < 8) {
                    // 총 근무시간이 4시간 이상 8시간 미만일 때
                    minutes -= 30;
                    if (minutes < 0) {
                        hours -= 1;
                        minutes += 60;
                    }
                } else if (hours >= 8) {
                    // 총 근무시간이 8시간 이상일 때
                    hours -= 1;
                }

                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            } else {
                return "00:00:00";
            }
        } else {
            // 평일 계산
            if (owStartTime && owEndTime && owStartTime !== "00:00:00" && owEndTime !== "00:00:00") {
                let totalSeconds;
                if (end > owEnd) {
                    totalSeconds = Math.floor((owEnd.getTime() - owStart.getTime()) / 1000);
                } else {
                    totalSeconds = Math.floor((end.getTime() - owStart.getTime()) / 1000);
                }

                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = totalSeconds % 60;

                return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            } else {
                return "00:00:00";
            }
        }
    };

    const workHours = calculateOverWorkHours(date, startTime, endTime, owStartTime, owEndTime);

    return (
        <>
            {workHours}
        </>
    );
};

export default OverWorkHoursCalculator;

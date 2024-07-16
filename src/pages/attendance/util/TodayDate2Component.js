import React from 'react';

const TodayDate2Component = () => {
    // 오늘 날짜를 가져오기
    const today = new Date();

    // 날짜 포맷팅 함수
    const formatDate2 = (date) => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (두 자리 수)
        const day = date.getDate().toString().padStart(2, '0'); // 일 (두 자리 수)
        return `${month}/${day}`;
    };

    return (
        <div className="hp_fw700">
            {formatDate2(today)}
        </div>
    );
};

export default TodayDate2Component;

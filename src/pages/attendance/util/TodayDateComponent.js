import React from 'react';

const TodayDateComponent = () => {
    // 오늘 날짜를 가져오기
    const today = new Date();

    // 날짜 포맷팅 함수
    const formatDate = (date) => {
        const year = date.getFullYear(); // 년도
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (두 자리 수)
        const day = date.getDate().toString().padStart(2, '0'); // 일 (두 자리 수)
        return `${year}년 ${month}월 ${day}일`;
    };

    return (
        <div className="hp_fw700">
            {formatDate(today)}
        </div>
    );
};

export default TodayDateComponent;

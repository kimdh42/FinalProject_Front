import React from 'react';

const MonthWeekComponent = () => {
    // 오늘 날짜를 가져오기
    const today = new Date();

    // 날짜를 기준으로 현재 주(주차)를 계산하여 출력하는 함수
    const calculateCurrentWeek = (date) => {
        const year = date.getFullYear(); // 년도
        const month = date.getMonth(); // 월
        const dayOfMonth = date.getDate(); // 월의 날짜

        // 현재 날짜를 기준으로 현재 주(주차)를 계산
        const start = new Date(year, month, 1); // 해당 월의 첫째날
        const weekNumber = Math.ceil((dayOfMonth + start.getDay()) / 7); // 현재 날짜를 기준으로 현재 주(주차) 계산

        // 한글 요일 이름 배열
        const weekNames = ['첫째주', '둘째주', '셋째주', '넷째주', '다섯째주'];

        return `${year}년 ${month + 1}월 ${weekNames[weekNumber - 1]}`;
    };

    return (
        <div className="hp_fw700">
            {calculateCurrentWeek(today)}
        </div>
    );
};

export default MonthWeekComponent;

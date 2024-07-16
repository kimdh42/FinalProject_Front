import React, { useState, useEffect } from 'react';

const TimeComponent = () => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            let period = hours >= 12 ? '오후' : '오전';
            hours = hours % 12 || 12; // 0시는 12시로 표시
            const formattedTime = `${period} ${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
            setCurrentTime(formattedTime);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hp_fw700 hp_fs28">
            {currentTime}
        </div>
    );
};
export default TimeComponent;
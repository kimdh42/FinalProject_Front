import React, { useState } from 'react';

const MoveButton = ({ toggleDiv }) => {
    const [moved, setMoved] = useState(false);

    const handleClick = () => {
        setMoved(!moved);
        toggleDiv();
    };

    return (
        <div style={{ marginTop: '10px', marginRight: '10px', position: 'relative', overflow: '', padding: '10px', width: '50px' }}>
            {/* 배경 원형 요소 */}
            <div
                style={{
                    position: 'absolute',
                    width: '50px',
                    height: '28px',
                    zIndex: 1,
                    backgroundColor: '#006CD0',
                    borderRadius: '15px'
                }}
            />
            {/* 움직이는 버튼 요소 */}
            <div
                onClick={handleClick}
                style={{
                    position: 'absolute',
                    top: '120%', // 부모 요소의 50% 위치
                    right: moved ? '5px' : 'calc(80% - 15px)', // 오른쪽 여백 설정
                    transform: 'translate(50%, -50%)', // 요소를 가운데로 정렬
                    width: '18px', // 너비 조정
                    height: '18px', // 높이 조정
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'right 0.5s ease',
                    zIndex: 2,
                }}
            />
        </div>
    );
};

export default MoveButton;

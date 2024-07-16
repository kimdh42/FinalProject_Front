import React from 'react';

function DayOffStatus() {
    return (
        <section className="bl_sect hp_padding30 el_shadowD4 hp_mb30 section1">
            <div className="ly_spaceBetween">
                <div className="hp_fw700">연차 소진 현황 (현월 기준)</div>
            </div>
            <ul className="hp_mt15">
                <li className=""><b className="hp_mr15">모든 연차 소진자</b> 1 / 30 명</li>
                <li className=""><b className="hp_mr15">연차 촉진 대상자</b> 15 / 30명</li>
            </ul>
        </section>
    );
}

export default DayOffStatus;
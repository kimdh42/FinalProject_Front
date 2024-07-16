import React from 'react';

function WorkStatus() {
    return (
        <section className="bl_sect hp_padding30 el_shadowD4 hp_mb30 section1">
            <div className="ly_spaceBetween">
                <div className="hp_fw700">월간 근무 현황</div>
            </div>
            <div className="hp_fw700 hp_fs28 hp_mt5">18h 00m</div>
            <div className="hp_mt15">막대그래프 자리</div>
            <ul className="hp_mt15">
                <li className=""><b className="hp_mr15">누적 정규 근무</b> 00:00:00</li>
                <li className=""><b className="hp_mr15">누적 초과 근무</b> 00:00:00</li>
            </ul>
        </section>
    );
}

export default WorkStatus;
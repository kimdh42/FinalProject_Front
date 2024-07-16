import React from 'react';
import WorkHoursCalculator from "../util/WorkHoursCalculator";
import OverWorkHoursCalculator from "../util/OverWorkHoursCalculator";
import WeekWorkHoursCalculator from "../util/WeekWorkHoursCalculator";

const WeekAttendance = ({ weekData, isOpen, toggle }) => {

    return (
        <div>
            <section className={`time_table bl_sect el_shadowD4 section2 ${isOpen ? 'go' : ''}`}>
                <ul className="bl_listRing" style={{ paddingTop: '30px', paddingRight: '10px' }}>
                    {weekData && weekData.length > 0 ? (
                        weekData.map((dayData, index) => (
                            <li className="bl_tnaWeek" key={index}>
                                <div className="ly_spaceBetween ly_fitemC">
                                    <div className="hp_fw700 hp_fs18 bl_tnaWeek__ttl letter03">{dayData.atdDate}</div>
                                    <div className="" style={{ width: '' }}>
                                        <ul className="ly_fgrow1 bl_tnaWeek__list"
                                            style={{display: 'flex', justifyContent: 'flex-end'}}>
                                            <li style={{ margin: '0 10px' }}><b
                                                className="hp_fw700">출근</b> &nbsp;{dayData.startTime !== null ? dayData.startTime : "00:00:00"}
                                            </li>
                                            <li style={{ margin: '0 10px' }}><b
                                                className="hp_fw700">퇴근</b> &nbsp;{dayData.endTime !== null ? dayData.endTime : "00:00:00"}
                                            </li>
                                            <li style={{ margin: '0 10px' }}><b className="hp_fw700">초과근무시간</b> &nbsp;
                                                {dayData.startTime !== null && dayData.endTime !== null ? (
                                                    <OverWorkHoursCalculator date={dayData.atdDate}
                                                                             startTime={dayData.startTime}
                                                                             endTime={dayData.endTime}
                                                                             owStartTime={dayData.owStartTime}
                                                                             owEndTime={dayData.owEndTime}/>
                                                ) : (
                                                    "00:00:00"
                                                )}
                                            </li>
                                            <li style={{ margin: '0 10px' }}><b className="hp_fw700">정규근무시간</b> &nbsp;
                                                {dayData.startTime !== null && dayData.endTime !== null ? (
                                                    <WeekWorkHoursCalculator date={dayData.atdDate}
                                                                             startTime={dayData.startTime}
                                                                             endTime={dayData.endTime}
                                                                             owStartTime={dayData.owStartTime}
                                                                             owEndTime={dayData.owEndTime}/>
                                                ) : (
                                                    "00:00:00"
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="bl_tnaWeek">데이터가 없습니다.</li>
                    )}
                </ul>
            </section>
        </div>
    );
};

export default WeekAttendance;

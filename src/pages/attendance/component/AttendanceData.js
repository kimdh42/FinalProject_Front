import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { calculateAttendanceCounts } from '../util/CalculateAttendanceCounts';

const AttendanceData = ({ sortedData }) => {
    const [checkIn, setCheckIn] = useState(0);
    const [late, setLate] = useState(0);
    const [noCheckIn, setNoCheckIn] = useState(0);
    const [dayOff, setDayOff] = useState(0);
    const [fieldWork, setFieldWork] = useState(0);
    const [business, setBusiness] = useState(0);
    const [all, setAll] = useState(0);

    // useEffect를 사용하여 sortedData가 변경될 때마다 호출
    useEffect(() => {
        calculateAttendanceCounts(sortedData, setCheckIn, setLate, setNoCheckIn, setDayOff, setFieldWork, setBusiness, setAll);
    }, [sortedData]); // sortedData가 변경될 때마다 호출

    return (
        <div className="hp_mt40" style={{ width: '300px' }}>
            <table className="ly_fitemC">
                <colgroup>
                    <col style={{ width: "20px" }} />
                    <col style={{ width: "20px" }} />
                    <col style={{ width: "20px" }} />
                    <col style={{ width: "20px" }} />
                    <col style={{ width: "20px" }} />
                    <col style={{ width: "20px" }} />
                </colgroup>
                <thead className="">
                <tr>
                    <th>
                        <div className="bl_tna__label4 hp_lh2-5 hp_mr15 hp_mb15">
                            <p style={{ color: "white" }}>전체인원</p>
                        </div>
                    </th>
                    <th>
                        <div className="bl_tna__label3 hp_lh2-5 hp_mr15 hp_mb15">
                            <p style={{ color: "#006CD0FF" }}>출근인원</p>
                        </div>
                    </th>
                    <th>
                        <div className="bl_tna__label3 hp_lh2-5 hp_mr15 hp_mb15">
                            <p style={{ color: "#006CD0FF" }}>지각인원</p>
                        </div>
                    </th>
                    <th>
                        <div className="bl_tna__label3 hp_lh2-5 hp_mr15 hp_mb15">
                            <p style={{ color: "#006CD0FF" }}>결근인원</p>
                        </div>
                    </th>
                    <th>
                        <div className="bl_tna__label3 hp_lh2-5 hp_mr15 hp_mb15">
                            <p style={{ color: "#006CD0FF" }}>휴가인원</p>
                        </div>
                    </th>
                    <th>
                        <div className="bl_tna__label3 hp_lh2-5 hp_mr15 hp_mb15">
                            <p style={{ color: "#006CD0FF" }}>외근인원</p>
                        </div>
                    </th>
                    <th>
                        <div className="bl_tna__label3 hp_lh2-5 hp_mr15 hp_mb15">
                            <p style={{ color: "#006CD0FF" }}>출장인원</p>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr className="">
                    <td>
                        <div className="hp_fw700 hp_fs28 ly_flexC hp_mr15">{all}</div>
                    </td>
                    <td>
                        <div className="hp_fw700 hp_fs28 ly_flexC hp_mr15">{checkIn}</div>
                    </td>
                    <td>
                        <div className="hp_fw700 hp_fs28 ly_flexC hp_mr20">{late}</div>
                    </td>
                    <td>
                        <div className="hp_fw700 hp_fs28 ly_flexC hp_mr20">{noCheckIn}</div>
                    </td>
                    <td>
                        <div className="hp_fw700 hp_fs28 ly_flexC hp_mr20">{dayOff}</div>
                    </td>
                    <td>
                        <div className="hp_fw700 hp_fs28 ly_flexC hp_mr20">{fieldWork}</div>
                    </td>
                    <td>
                        <div className="hp_fw700 hp_fs28 ly_flexC hp_mr20">{business}</div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

AttendanceData.propTypes = {
    sortedData: PropTypes.array.isRequired,
};

export default AttendanceData;

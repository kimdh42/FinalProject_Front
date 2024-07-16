import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
    callAttendanceAllAPI,
    callAttendanceTodayAPI,
    callMyAttendanceForWeekAPI
} from '../../../apis/AttendancelAPICalls';

const AttendanceButton = () => {
    const [isAttended, setIsAttended] = useState(false); // 출근 상태를 관리하는 상태
    const [endTime, setEndTime] = useState(null); // 퇴근 시간을 저장할 상태
    const dispatch = useDispatch();

    useEffect(() => {
        // 페이지 로드 시, 사용자의 출근 상태를 체크하여 버튼 초기화
        checkAttendanceStatus();
    }, []);

    const checkAttendanceStatus = async () => {
        try {
            const token = localStorage.getItem('access-token');
            if (!token) {
                throw new Error('접근 권한이 없습니다.');
            }

            const response = await axios.get('http://localhost:8080/api/attendance/today', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('오늘 출근 확인 결과:', response.data);

            const { attendance } = response.data.results;
            if (attendance.startTime && !attendance.endTime) {
                // 출근 기록이 있고 퇴근 기록이 없으면 퇴근하기 버튼 표시
                setIsAttended(true);
            } else if (attendance.startTime && attendance.endTime) {
                // 출근 및 퇴근 기록이 모두 있으면 업무 종료 상태 설정
                setIsAttended(false);
                setEndTime(attendance.endTime);
            } else {
                // 그 외의 경우 출근하기 버튼 표시
                setIsAttended(false);
                setEndTime(null);
            }
        } catch (error) {
            console.error('출근 상태 확인 실패:', error);
        }
    };

    const handleAttendance = async () => {
        try {
            const token = localStorage.getItem('access-token');
            if (!token) {
                throw new Error('접근 권한이 없습니다.');
            }

            if (!isAttended) {
                // 출근하지 않은 상태에서 출근 처리
                const response = await axios.post('http://localhost:8080/api/attendance/registStartTime', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('출근 처리 결과:', response.data);

                // 출근 처리 후 상태 업데이트
                setIsAttended(true);
                alert('출근이 완료되었습니다.');

                // 출근 시간 등록 후 Redux 상태 업데이트
                dispatch(callAttendanceTodayAPI());
                dispatch(callMyAttendanceForWeekAPI());
                dispatch(callAttendanceAllAPI());

            } else {
                // 이미 출근한 상태에서 퇴근 처리
                const response = await axios.post('http://localhost:8080/api/attendance/registEndTime', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('퇴근 처리 결과:', response.data);

                // 퇴근 처리 후 상태 업데이트
                setIsAttended(false);
                setEndTime(response.data.results.endTime);
                alert('퇴근이 완료되었습니다.');

                // 퇴근 시간 등록 후 Redux 상태 업데이트
                dispatch(callAttendanceTodayAPI());
                dispatch(callMyAttendanceForWeekAPI());
                dispatch(callAttendanceAllAPI());
            }
        } catch (error) {
            console.error('출근/퇴근 처리 실패:', error);
            alert('이미 등록된 기록이 있습니다. 관리자에게 문의하세요.');
        }
    };

    return (
        <div>
            {isAttended && !endTime && (
                <button type="button" className="el_btn0Back el_btnF hp_mt20 hp_fs16" onClick={handleAttendance}>
                    퇴근하기
                </button>
            )}
            {!isAttended && !endTime && (
                <button type="button" className="el_btn0Back el_btnF hp_mt20 hp_fs16" onClick={handleAttendance}>
                    출근하기
                </button>
            )}
            {endTime && (
                <button type="button" className="el_btn8Back el_btnF hp_mt20 hp_fs16">
                    업무 종료
                </button>
            )}
        </div>
    );
};

export default AttendanceButton;

export const CalculateAttendanceCounts = (sortedData, setCheckIn, setLate, setNoCheckIn, setDayOff, setFieldWork, setBusiness, setAll) => {
    // 출근 인원 수 계산
    const checkInCount = sortedData.filter(data => data.attendanceStatus.atsName === '출근').length;
    setCheckIn(checkInCount);

    // 지각 인원 수 계산 (지각 + 미출근)
    const lateCount1 = sortedData.filter(data => data.attendanceStatus.atsName === '지각').length;
    const lateCount2 = sortedData.filter(data => data.attendanceStatus.atsName === '미출근').length;
    setLate(lateCount1 + lateCount2);

    // 결근 인원 수 계산
    const NoCheckInCount = sortedData.filter(data => data.attendanceStatus.atsName === '결근').length;
    setNoCheckIn(NoCheckInCount);

    // 휴가 인원 수 계산
    const DayOffCount = sortedData.filter(data => data.attendanceStatus.atsName === '휴가').length;
    setDayOff(DayOffCount);

    // 외근 인원 수 계산
    const fieldWorkCount = sortedData.filter(data => data.attendanceStatus.atsName === '외근').length;
    setFieldWork(fieldWorkCount);

    // 출장 인원 수 계산
    const businessCount = sortedData.filter(data => data.attendanceStatus.atsName === '출장').length;
    setBusiness(businessCount);

    // 전체 인원 수 계산 (휴직 제외)
    setAll(checkInCount + lateCount1 + lateCount2 + NoCheckInCount + DayOffCount + fieldWorkCount + businessCount);
};

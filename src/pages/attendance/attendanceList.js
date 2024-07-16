import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import AttendanceSummary from "./component/AttendanceSummary";
import DefaultSchedule from "./component/DefaultSchedule";
import WorkStatus from "./component/WorkStatus";
import WorkHoursCalculator from "./util/WorkHoursCalculator";
import PagingBar from "../../components/commons/PagingBar";
import { useDispatch, useSelector } from "react-redux";
import {
    callAttendanceAllAPI,
    callAttendanceTodayAPI,
    callMyAttendanceForWeekAPI,
    callMyInfoAPI
} from "../../apis/AttendancelAPICalls";
import DropdownComponent from "./component/DropdownComponent";
import OverWorkHoursCalculator from "./util/OverWorkHoursCalculator";

function AttendanceList() {
    const dispatch = useDispatch();
    const attendancesToday = useSelector((state) => state.attendanceReducer.attendanceToday);
    const attendancesAll = useSelector((state) => state.attendanceReducer.attendanceAll);
    const employee = useSelector((state) => state.attendanceReducer.employee);

    useEffect(() => {
        dispatch(callMyInfoAPI());
        dispatch(callMyAttendanceForWeekAPI());
        dispatch(callAttendanceTodayAPI());
        dispatch(callAttendanceAllAPI());
    }, [dispatch]);

    // 검색 및 필터링 상태 변수
    const [searchTerm, setSearchTerm] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [parentDept, setParentDept] = useState('');
    const [subDept, setSubDept] = useState('');
    const [team, setTeam] = useState('');

    // 페이징
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    // 검색 및 필터링된 결과 상태
    const [searchResults, setSearchResults] = useState(attendancesAll || []);

    // 드롭다운 박스 옵션
    const departments = [
        {
            name: '전략기획부',
            subDepartments: [
                {
                    name: '영업부',
                    teams: ['영업기획팀', '고객관리팀']
                },
                {
                    name: '마케팅부',
                    teams: ['브랜드관리팀', '디지털마케팅팀']
                }
            ]
        },
        {
            name: '경영지원부',
            subDepartments: [
                {
                    name: '인사부',
                    teams: ['채용팀', '교육개발팀']
                },
                {
                    name: '정보기술부',
                    teams: ['시스템개발팀', '정보보안팀']
                }
            ]
        }
    ];

    // 권한 확인 함수
    const userRoleData = {
        empTitle: employee.title_code, // 사용자 직책
        deptCode: employee.dept_code // 사용자 부서코드
    };

    // 상위 부서 선택 핸들러
    const handleParentDeptChange = (e) => {
        const selectedParentDept = e.target.value;
        setParentDept(selectedParentDept);
    };

    // 하위 부서 선택 핸들러
    const handleSubDeptChange = (e) => {
        const selectedSubDept = e.target.value;
        setSubDept(selectedSubDept);
    };

    // 팀명 선택 핸들러
    const handleTeamChange = (e) => {
        const selectedTeam = e.target.value;
        setTeam(selectedTeam);
    };

    // 검색어 입력 처리 함수
    const handleSearch = (e) => {
        e.preventDefault();
        filterAttendances();
    };

    // 필터링 함수
    const filterAttendances = () => {
        let filteredResults = attendancesAll || [];

        if (year) {
            filteredResults = filteredResults.filter(attendance => attendance.atdDate.startsWith(year));
        }

        if (month) {
            filteredResults = filteredResults.filter(attendance => attendance.atdDate.includes(`-${month.padStart(2, '0')}-`));
        }

        if (parentDept) {
            filteredResults = filteredResults.filter(attendance => attendance.parTitle === parentDept);
        }

        if (subDept) {
            filteredResults = filteredResults.filter(attendance => attendance.subTitle === subDept);
        }

        if (team) {
            filteredResults = filteredResults.filter(attendance => attendance.deptTitle === team);
        }

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filteredResults = filteredResults.filter(attendance =>
                attendance.empName.toLowerCase().includes(lowercasedTerm) ||
                attendance.empCode.toLowerCase().includes(lowercasedTerm)
            );
        }

        setSearchResults(filteredResults);
        setCurrentPage(1); // 필터링 시 첫 페이지로 초기화
    };

    // 최초 로드 시 자신의 데이터만 표시
    useEffect(() => {
        const filteredAttendances = attendancesAll.filter(attendances =>
            attendances.empCode === employee.emp_code
        );
        setSearchResults(filteredAttendances);
        setCurrentPage(1); // 데이터가 변경될 때 첫 페이지로 초기화
    }, [attendancesAll, employee]);

    // 현재 페이지의 결과 계산
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
    const totalPages = Math.ceil(searchResults.length / resultsPerPage);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    // 엑셀 다운로드 함수
    const handleExcelDownload = () => {
        const workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.json_to_sheet(
            searchResults.map((attendance) => ({
                '근무날짜': attendance.atdDate,
                '사원번호': attendance.empCode,
                '상위부서명': attendance.parTitle,
                '하위부서명': attendance.subTitle,
                '팀명': attendance.deptTitle,
                '사원명': attendance.empName,
                '지정출근시간': attendance.atdStartTime,
                '지정퇴근시간': attendance.atdEndTime,
                '출근시간': attendance.startTime || '-',
                '퇴근시간': attendance.endTime || '-',
                '근무시간': calculateWorkHours(attendance.startTime, attendance.endTime), // 계산 결과도 필드에 추가
            }))
        );

        XLSX.utils.book_append_sheet(workbook, sheet, 'Attendance Data');
        XLSX.writeFile(workbook, 'attendance_data.xlsx');
    };

    // 근무 시간 계산 함수
    const calculateWorkHours = (startTime, endTime) => {
        if (!startTime || !endTime || startTime === "00:00:00" || endTime === "00:00:00") {
            return "00:00:00";
        }

        // 시작 시간과 종료 시간을 Date 객체로 변환
        const start = new Date(`1970-01-01T${startTime}`);
        const end = new Date(`1970-01-01T${endTime}`);

        // 시간 차이 계산 (밀리초 단위)
        const diffMs = end.getTime() - start.getTime();

        // 밀리초를 시간, 분, 초로 변환
        let totalSeconds = Math.floor(diffMs / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        // 시간, 분, 초를 '00:00:00' 형식으로 포맷팅
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        return formattedTime;
    };


    return (
        <div className="ly_cont ly_flex">
            <div className="hp_mr50">
                <div style={{ position: "sticky" }}>
                    <AttendanceSummary attendancesToday={attendancesToday} />
                    <DefaultSchedule employee={employee} attendancesToday={attendancesToday}/>
                    <WorkStatus />
                </div>
            </div>
            <div className="">
                <div className="" style={{ width: '1200px' }}>
                    <div className="ly_spaceBetween ly_fitemEnd hp_mb30">
                        <h4 className="el_lv1Head" style={{ paddingLeft: '10px' }}>상세 근태 현황</h4>
                    </div>
                    <div className="ly_spaceBetween hp_mt20"
                         style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <select className="hp_mr5" defaultValue="" onChange={(e) => setYear(e.target.value)}>
                                <option value="">년도</option>
                                <option value="2024">2024년</option>
                                <option value="2023">2023년</option>
                                {/* Add more years as needed */}
                            </select>
                            <select className="hp_mr5" defaultValue="" onChange={(e) => setMonth(e.target.value)}>
                                <option value="">월</option>
                                <option value="01">1월</option>
                                <option value="02">2월</option>
                                <option value="03">3월</option>
                                <option value="04">4월</option>
                                <option value="05">5월</option>
                                <option value="06">6월</option>
                                <option value="07">7월</option>
                                <option value="08">8월</option>
                                <option value="09">9월</option>
                                <option value="10">10월</option>
                                <option value="11">11월</option>
                                <option value="12">12월</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <DropdownComponent
                                departmentsData={departments}
                                userRoleData={userRoleData}
                                handleParentDeptChange={handleParentDeptChange}
                                handleSubDeptChange={handleSubDeptChange}
                                handleTeamChange={handleTeamChange}
                            />
                            <button type="button" className="el_btnS el_btnblueBord hp_mr5" onClick={handleSearch}>
                                검색
                            </button>
                            <button type="button" className="el_btnS el_btnblueBack" onClick={handleExcelDownload}>
                                엑셀 다운로드
                            </button>
                        </div>
                    </div>
                    <section className="bl_sect hp_mt10" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                        <table className="bl_tb1" style={{ width: '100%' }}>
                            <colgroup>
                                <col style={{ width: "45px" }} />
                                <col style={{ width: "90px" }} />
                                <col style={{ width: "80px" }} />
                                <col style={{ width: "95px" }} />
                                <col style={{ width: "95px" }} />
                                <col style={{ width: "95px" }} />
                                <col style={{ width: "85px" }} />
                                <col style={{ width: "100px" }} />
                                <col style={{ width: "100px" }} />
                                <col style={{ width: "100px" }} />
                                <col style={{ width: "100px" }} />
                            </colgroup>
                            <thead>
                            <tr>
                                <th scope="col"><input type="checkbox" className="" id="" name=""
                                                       value="checkAll" /></th>
                                <th scope="col">근무날짜</th>
                                <th scope="col">사원번호</th>
                                <th scope="col">상위부서명</th>
                                <th scope="col">하위부서명</th>
                                <th scope="col">팀명</th>
                                <th scope="col">사원명</th>
                                <th scope="col">지정출근시간</th>
                                <th scope="col">지정퇴근시간</th>
                                <th scope="col">출근시간</th>
                                <th scope="col">퇴근시간</th>
                                <th scope="col">정규근무시간</th>
                                <th scope="col">초과근무시간</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentResults.length > 0 ? (
                                currentResults.map((attendance, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" className="" id="" name=""
                                                   value="checkOne" /></td>
                                        <td>{attendance.atdDate}</td>
                                        <td className="" style={{ textAlign: 'center' }}>{attendance.empCode}</td>
                                        <td>{attendance.parTitle ? attendance.parTitle : "-"}</td>
                                        <td>{attendance.subTitle ? attendance.subTitle : "-"}</td>
                                        <td>{attendance.deptTitle ? attendance.deptTitle : "-"}</td>
                                        <td>{attendance.empName}</td>
                                        <td>{attendance.atdStartTime}</td>
                                        <td>{attendance.atdEndTime}</td>
                                        <td>{attendance.startTime || '-'}</td>
                                        <td>{attendance.endTime || '-'}</td>
                                        <td><WorkHoursCalculator date={attendance.atdDate}
                                                                 startTime={attendance.startTime}
                                                                 endTime={attendance.endTime}
                                                                 owStartTime={attendance.owStartTime}
                                                                 owEndTime={attendance.owEndTime}/></td>
                                        <td>{attendance.startTime !== null && attendance.endTime !== null ? (
                                            <OverWorkHoursCalculator date={attendance.atdDate}
                                                                     startTime={attendance.startTime}
                                                                     endTime={attendance.endTime}
                                                                     owStartTime={attendance.owStartTime}
                                                                     owEndTime={attendance.owEndTime}/>
                                        ) : (
                                            "00:00:00"
                                        )}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="13" style={{ textAlign: 'center' }}>데이터가 없습니다.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </section>
                    <div className="ly_spaceBetween ly_fitemC hp_mt10">
                        <div className="hp_ml10 hp_7Color">총 &nbsp;<b
                            className="hp_0Color hp_fw700">{currentPage}</b> / {totalPages} 페이지
                        </div>
                    </div>
                    <PagingBar pageInfo={{ currentPage, maxPage: totalPages }} setCurrentPage={handlePageChange} />
                </div>
            </div>
        </div>
    );
}

export default AttendanceList;

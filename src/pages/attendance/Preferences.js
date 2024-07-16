import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import PagingBar from "../../components/commons/PagingBar";
import { useDispatch, useSelector } from "react-redux";
import {
    callDefaultScheduleAPI, callEmployeeInfoAPI,
    callMyInfoAPI
} from "../../apis/AttendancelAPICalls";
import DropdownComponent from "./component/DropdownComponent";
import Modal from "../attendance/util/Modal"; // EventModal을 임포트

function Preferences() {
    const dispatch = useDispatch();
    const schedules = useSelector((state) => state.attendanceReducer.schedules);
    const employee = useSelector((state) => state.attendanceReducer.employee);
    const dayOffsAll = useSelector((state) => state.attendanceReducer.dayOffs);

    useEffect(() => {
        dispatch(callMyInfoAPI());
        dispatch(callDefaultScheduleAPI());
    }, [dispatch]);

    // 검색 및 필터링 상태 변수
    const [searchTerm, setSearchTerm] = useState('');
    const [parentDept, setParentDept] = useState('');
    const [subDept, setSubDept] = useState('');
    const [team, setTeam] = useState('');

    // 페이징
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    // 검색 및 필터링된 결과 상태
    const [searchResults, setSearchResults] = useState(dayOffsAll || []);

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
        filterDayOff();
    };

    // 필터링 함수
    const filterDayOff = () => {
        let filteredResults = schedules || [];

        if (parentDept) {
            filteredResults = filteredResults.filter(schedules => schedules.parTitle === parentDept);
        }

        if (subDept) {
            filteredResults = filteredResults.filter(schedules => schedules.subTitle === subDept);
        }

        if (team) {
            filteredResults = filteredResults.filter(schedules => schedules.deptTitle === team);
        }

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filteredResults = filteredResults.filter(schedules =>
                schedules.empName.toLowerCase().includes(lowercasedTerm) ||
                schedules.empCode.toLowerCase().includes(lowercasedTerm)
            );
        }

        setSearchResults(filteredResults);
        setCurrentPage(1); // 필터링 시 첫 페이지로 초기화
    };

    // 최초 로드 시 전체 데이터 표시
    useEffect(() => {
        setSearchResults(schedules); // 전체 데이터 설정
        setCurrentPage(1); // 데이터가 변경될 때 첫 페이지로 초기화
    }, [schedules]);

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

    // 모달 핸들러
    const [showEventModal, setShowEventModal] = useState(false);

    const handleShowModal = () => {
        setShowEventModal(true);
    };

    const handleCloseModal = () => {
        setShowEventModal(false);
    };

    const handleSaveEvent = (formData) => {
        // 이벤트 저장 로직 추가
        console.log("Saved event data:", formData);
    };

    return (
        <div className="ly_cont ly_flex">
            <div className="" style={{ width: "100%" }}>
                <div className="">
                    <div className="ly_spaceBetween ly_fitemEnd hp_mb30">
                        <h4 className="el_lv1Head" style={{ paddingLeft: '10px' }}>지정 근무시간 관리</h4>
                    </div>
                    <div className="ly_spaceBetween hp_mt20"
                         style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <DropdownComponent
                                departmentsData={departments}
                                userRoleData={userRoleData}
                                handleParentDeptChange={handleParentDeptChange}
                                handleSubDeptChange={handleSubDeptChange}
                                handleTeamChange={handleTeamChange}
                            />
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <button type="button" className="el_btnS el_btnblueBord hp_mr5" onClick={handleSearch}>
                                검색
                            </button>
                            <button type="button" className="el_btnS el_btnblueBack hp_mr5" onClick={handleShowModal}>
                                등록
                            </button>
                            <button type="button" className="el_btnS el_btnblueBack hp_mr5">
                                수정
                            </button>
                            <button type="button" className="el_btnS el_btnblueBack">
                                삭제
                            </button>
                        </div>
                    </div>
                    <section className="bl_sect hp_mt10" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                        <table className="bl_tb1" style={{ width: '100%' }}>
                            <colgroup>
                                <col style={{ width: "35px" }} />
                                <col style={{ width: "35px" }} />
                                <col style={{ width: "70px" }} />
                                <col style={{ width: "70px" }} />
                                <col style={{ width: "70px" }} />
                                <col style={{ width: "70px" }} />
                                <col style={{ width: "55px" }} />
                                <col style={{ width: "80px" }} />
                                <col style={{ width: "80px" }} />
                                <col style={{ width: "65px" }} />
                            </colgroup>
                            <thead>
                            <tr>
                                <th scope="col"><input type="checkbox" className="" id="" name=""
                                                       value="checkAll" /></th>
                                <th scope="col">코드번호</th>
                                <th scope="col">상위부서명</th>
                                <th scope="col">하위부서명</th>
                                <th scope="col">팀명</th>
                                <th scope="col">사원명</th>
                                <th scope="col">시작일자</th>
                                <th scope="col">종료일자</th>
                                <th scope="col">시작시간</th>
                                <th scope="col">종료시간</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentResults.length > 0 ? (
                                currentResults.map((schedules, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" className="" id="" name=""
                                                   value="checkOne" /></td>
                                        <td>{schedules.dsCode}</td>
                                        <td>{schedules.parTitle ? schedules.parTitle : "-"}</td>
                                        <td>{schedules.subTitle ? schedules.subTitle : "-"}</td>
                                        <td>{schedules.deptTitle ? schedules.deptTitle : "-"}</td>
                                        <td>{schedules.empName ? schedules.empName : "-"}</td>
                                        <td>{schedules.dsStartDate}</td>
                                        <td>{schedules.dsEndDate}</td>
                                        <td>{schedules.atdStartTime}</td>
                                        <td>{schedules.atdEndTime}</td>
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
            <Modal show={showEventModal} handleClose={handleCloseModal} handleSave={handleSaveEvent} />
        </div>
    );
}

export default Preferences;

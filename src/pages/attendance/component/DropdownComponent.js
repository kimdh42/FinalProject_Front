import React, { useState, useEffect } from 'react';

const DropdownComponent = ({ departmentsData, userRoleData, handleParentDeptChange, handleSubDeptChange, handleTeamChange }) => {
    const [parentDeptOptions, setParentDeptOptions] = useState([]);
    const [subDeptOptions, setSubDeptOptions] = useState([]);
    const [teamOptions, setTeamOptions] = useState([]);

    useEffect(() => {
        // 사용자의 직책과 부서코드에 따라 필요한 부서 및 팀 옵션 설정
        const { empTitle, deptCode } = userRoleData;

        if (empTitle === 'T2') {
            if (deptCode === 'D2') {
                // T2, D2에 대한 설정
                const parentDept = departmentsData.find(dep => dep.name === '전략기획부');
                if (parentDept) {
                    setParentDeptOptions([parentDept]);
                    const allSubDepts = parentDept.subDepartments;
                    setSubDeptOptions(allSubDepts);
                    const allTeams = allSubDepts.reduce((teams, subDep) => [...teams, ...subDep.teams], []);
                    setTeamOptions(allTeams);
                }
            } else if (deptCode === 'D3') {
                // T2, D3에 대한 설정
                const parentDept = departmentsData.find(dep => dep.name === '경영지원부');
                if (parentDept) {
                    setParentDeptOptions([parentDept]);
                    const allSubDepts = parentDept.subDepartments;
                    setSubDeptOptions(allSubDepts);
                    const allTeams = allSubDepts.reduce((teams, subDep) => [...teams, ...subDep.teams], []);
                    setTeamOptions(allTeams);
                }
            }
        } else if (empTitle === 'T4') {
            if (deptCode === 'D7') {
                // T4, D7에 대한 설정
                const parentDept = departmentsData.find(dep => dep.name === '전략기획부');
                if (parentDept) {
                    setParentDeptOptions([parentDept]);
                    const subDept = parentDept.subDepartments.find(subDep => subDep.name === '영업부');
                    if (subDept) {
                        setSubDeptOptions([subDept]);
                        const teamOptions = subDept.teams.filter(team => team === '영업기획팀' || team === '고객관리팀');
                        setTeamOptions(teamOptions);
                    }
                }
            } else if (deptCode === 'D10') {
                // T4, D10에 대한 설정
                const parentDept = departmentsData.find(dep => dep.name === '전략기획부');
                if (parentDept) {
                    setParentDeptOptions([parentDept]);
                    const subDept = parentDept.subDepartments.find(subDep => subDep.name === '마케팅부');
                    if (subDept) {
                        setSubDeptOptions([subDept]);
                        const teamOptions = subDept.teams;
                        setTeamOptions(teamOptions);
                    }
                }
            } else if (deptCode === 'D4' || deptCode === 'D13') {
                // T4, D4 또는 T4, D13에 대한 설정 (경영지원부 인사부 또는 정보기술부)
                const parentDept = departmentsData.find(dep => dep.name === '경영지원부');
                if (parentDept) {
                    setParentDeptOptions([parentDept]);
                    let subDept;
                    if (deptCode === 'D4') {
                        subDept = parentDept.subDepartments.find(subDep => subDep.name === '인사부');
                    } else if (deptCode === 'D13') {
                        subDept = parentDept.subDepartments.find(subDep => subDep.name === '정보기술부');
                    }
                    if (subDept) {
                        setSubDeptOptions([subDept]);
                        const teamOptions = subDept.teams;
                        setTeamOptions(teamOptions);
                    }
                }
            }
        } else if (empTitle === 'T5') {
            if (deptCode === 'D8') {
                // T5, D8에 대한 설정
                const parentDept = departmentsData.find(dep => dep.name === '전략기획부');
                if (parentDept) {
                    setParentDeptOptions([parentDept]);
                    const subDept = parentDept.subDepartments.find(subDep => subDep.name === '영업부');
                    if (subDept) {
                        setSubDeptOptions([subDept]);
                        const teamOptions = subDept.teams.filter(team => team === '영업기획팀');
                        setTeamOptions(teamOptions);
                    }
                }
            } else if (deptCode === 'D9') {
                // T5, D9에 대한 설정
                const parentDept = departmentsData.find(dep => dep.name === '전략기획부');
                if (parentDept) {
                    setParentDeptOptions([parentDept]);
                    const subDept = parentDept.subDepartments.find(subDep => subDep.name === '영업부');
                    if (subDept) {
                        setSubDeptOptions([subDept]);
                        const teamOptions = subDept.teams.filter(team => team === '고객관리팀');
                        setTeamOptions(teamOptions);
                    }
                }
            } else if (deptCode === 'D10') {
                // T5, D10에 대한 설정
                const parentDept = departmentsData.find(dep => dep.name === '전략기획부');
                if (parentDept) {
                    setParentDeptOptions([parentDept]);
                    const subDept = parentDept.subDepartments.find(subDep => subDep.name === '마케팅부');
                    if (subDept) {
                        setSubDeptOptions([subDept]);
                        const teamOptions = subDept.teams.filter(team => team === '브랜드관리팀' || team === '디지털마케팅팀');
                        setTeamOptions(teamOptions);
                    }
                }
            } else if (deptCode === 'D5' || deptCode === 'D6' || deptCode === 'D14' || deptCode === 'D15') {
                // T5, D5 또는 T5, D6 또는 T5, D14 또는 T5, D15에 대한 설정 (경영지원부 인사부, 교육개발팀, 정보기술부 시스템개발팀, 정보보안팀)
                const parentDept = departmentsData.find(dep => dep.name === '경영지원부');
                if (parentDept) {
                    setParentDeptOptions([parentDept]);
                    let subDept;
                    if (deptCode === 'D5') {
                        subDept = parentDept.subDepartments.find(subDep => subDep.name === '인사부');
                    } else if (deptCode === 'D6') {
                        subDept = parentDept.subDepartments.find(subDep => subDep.name === '인사부');
                    } else if (deptCode === 'D14') {
                        subDept = parentDept.subDepartments.find(subDep => subDep.name === '정보기술부');
                    } else if (deptCode === 'D15') {
                        subDept = parentDept.subDepartments.find(subDep => subDep.name === '정보기술부');
                    }
                    if (subDept) {
                        setSubDeptOptions([subDept]);
                        const teamOptions = subDept.teams;
                        setTeamOptions(teamOptions);
                    }
                }
            }
        } else {
            // 기타 경우 초기화
            setParentDeptOptions([]);
            setSubDeptOptions([]);
            setTeamOptions([]);
        }
    }, [departmentsData, userRoleData]);

    return (
        <>
            <select value={parentDeptOptions.length > 0 ? parentDeptOptions[0].name : ''} onChange={handleParentDeptChange} className="hp_mr5">
                <option value="">상위부서명</option>
                {parentDeptOptions.map(dep => (
                    <option key={dep.name} value={dep.name}>{dep.name}</option>
                ))}
            </select>
            <select value={subDeptOptions.length > 0 ? subDeptOptions[0]?.name : ''} onChange={handleSubDeptChange} className="hp_mr5">
                <option value="">하위부서명</option>
                {subDeptOptions.map(subDep => (
                    <option key={subDep.name} value={subDep.name}>{subDep.name}</option>
                ))}
            </select>
            <select onChange={handleTeamChange} className="hp_mr10">
                <option value="">팀명</option>
                {teamOptions.map(team => (
                    <option key={team} value={team}>{team}</option>
                ))}
            </select>
        </>
    );
};

export default DropdownComponent;

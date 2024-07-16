import { request } from './api';
import { getDepartments, getDeptEmployees, getMyInfo, getRecordcard, getDeptDetail, success, getTeamRecordcard, registEmployees, getTitles, getPositions, getRegistEmpList, getRegistEmpListDetail, getOrgChart, registAppoints, getEmployeeAll, getRegistAppList, getRegistAppListDetail, updateMyInfo, registMyRecordcard, updateMyRecordcard, uploadProfileImg, getProfileImg } from '../modules/EmployeeModules';


export const callDepartmentEmployeesAPI = () => {

    return async (dispatch, getState) => {

        try {
            const result = await request('GET', '/employee/employeeList', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log('callDepartmentEmployeesAPI result : ', result);

            if (result && result.status === 200) {

                dispatch(getDeptEmployees(result.data));

            } else {
                console.error('팀원 정보 조회 실패 : ', result);
            }
        } catch (error) {
            console.error('팀원 정보 조회 실패 : ', error);
        }
    };
};

export const callMyInfoAPI = () => {

    return async (dispatch, getState) => {

        try {
            const result = await request('GET', '/employee/myInfo', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });
            // 이다정: 주석처리
            // console.log('callMyInfoAPI result : ', result);

            if (result && result.status === 200) {

                dispatch(getMyInfo(result.data));
            } else {
                console.log('내정보 조회 실패 result : ', result);
            }
        } catch (error) {
            console.log('내정보 조회 실패 error : ', error);
        }
    };
};

export const callUpdateMyInfoAPI = (formData) => {

    return async (dispatch, getState) => {

        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const result = await request('PATCH', '/employee/updateMyInfo', headers, formData);

            console.log('callUpdateMyInfo result', result);

            if (result && result.status === 200) {

                console.log('Dispatching updateMyInfo with data: ', result.data);

                dispatch(updateMyInfo(result.data));
                dispatch(getMyInfo(result.data));

            } else {
                console.log('내정보 수정 실패 result', result);
            }
        } catch (error) {
            console.error('내정보 수정 실패 error', error);
        }
    };
};

export const callEmployeeAll = () => {

    return async (dispatch, getState) => {

        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const result = await request('GET', '/employee/employeeAll', headers);

            console.log('callEmployeeAll result : ', result);

            if (result && result.status === 200) {

                console.log('Dispatching getOrgChart with data: ', result.data);

                dispatch(getEmployeeAll(result.data));

            } else {
                console.log('전체 사원 조회 실패 result', result);
            }
        } catch (error) {
            console.error('전체 사원 조회 실패 error', error);
        }
    };
};


export const callRecordCardAPI = () => {

    return async (dispatch, getState) => {

        try {
            const result = await request('GET', '/employee/recordCard', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            // console.log('callRecordCardAPI result: ', result);

            if (result && result.status === 200) {

                // console.log('Dispatching getRecordCard with data: ', result.data);

                dispatch(getRecordcard(result.data));

            } else {

                console.log('인사기록카드 조회 실패(result)', result);

            }
        } catch (error) {

            console.error('인사기록카드 조회 실패(error)', error)
        }
    };
};

export const callRegistRecordCardAPI = (registRecordCard) => {

    return async (dispatch, getState) => {

        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const result = await request('POST', '/employee/registRecordCard', headers, registRecordCard);

            // console.log('callRegistRecordCardAPI result: ', result);

            if(result && result.status === 201) {

                // console.log('Dispatching registMyRecordcard with data: ', result.data);

                dispatch(registMyRecordcard(result.data));

            } else {

                console.log('인사기록카드 등록 실패 result', result);
            }
        } catch (error) {
            console.error('인사기록카드 등록 실패 error', error);
        }
    };
};

export const callUpdateRecordCardAPI = (updatedRecordCard) => {

    return async (dispatch, getState) => {

        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": 'application/json'
            };

            const result = await request('PACTH', '/employee/updateRecordCard', headers, updatedRecordCard);

            console.log('callUpdateRecordCard result : ', result);

            if(result && result.status === 200) {

                console.log('Dispatching updateMyRecordcard with data: ', result.data);

                dispatch(updateMyRecordcard(result.data));

            } else {
                console.log('인사기록카드 수정 실패 result', result);
            }
        } catch(error) {
            console.error('인사기록카드 수정 실패 error', error);
        }
    };
};

// 부서 전체 단순 조회 : 이다정
export const callsimpleDeptsAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/employee/simpleDepts',);

            if(result && result.status === 200) {
                dispatch(getDepartments(result.data));
            } else {
                console.log('부서 전체 단순 조회 실패(result): ', result);
            }
        } catch(error) {
            console.error('부서 전체 단순 조회 실패(error): ', error);
        }
    };
}

export const callDepartmentsAPI = () => {

    return async (dispatch, getState) => {

        try {
            const result = await request('GET', '/employee/departments',);

            // console.log('callDepartmentsAPI result: ', result);

            if (result && result.status === 200) {

                // console.log('Dispatching getDepartments with data: ', result.data);

                dispatch(getDepartments(result.data));

            } else {

                console.log('부서목록 조회 실패(result): ', result);
            }
        } catch (error) {
            console.error('부서목록 조회 실패(error): ', error);
        }
    };
};

export const callTitlesAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/employee/empTitles',);

            if (result && result.status === 200) {

                dispatch(getTitles(result.data));

            } else {

                console.log('직위목록 조회 실패(result): ', result);
            }
        } catch (error) {
            console.error('직위목록 조회 실패(error): ', error);
        }
    }
}

export const callDeptDetailAPI = (deptCode) => {

    return async (dispatch, getState) => {

        try {
            const result = await request('GET', `/employee/deptDetailList/${deptCode}`);

            console.log('callDeptDetailAPI result: ', result);

            if (result && result.status === 200) {

                console.log('Dispatching getDeptDetail with data: ', result.data);

                dispatch(getDeptDetail(result.data));

            } else {

                console.log('부서상세 조회 실패(result): ', result);
            }
        } catch (error) {
            console.error('부서상세 조회 실패(error): ', error);
        }
    };
};

export const callRegistDeptAPI = (deptTitle) => {

    return async (dispatch, getState) => {
        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const requestData = {
                dept_title: deptTitle // 부서 제목을 요청 데이터에 추가
            };

            const result = await request('POST', `/employee/registDept`, headers, requestData);

            console.log('callRegistDeptAPI : ', result);

            if (result && result.status === 201) {

                dispatch(success());
                dispatch(callDepartmentsAPI()); // 부서 등록 성공 후에 부서 목록 다시 가져오기
            }
        } catch (error) {
            console.error('부서 등록 실패 : ', error)
        }
    };
};

export const callRegistDeptRelationsAPI = (parentDeptCode, subDeptCode) => {

    return async (dispatch, getState) => {
        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const requestData = {
                parentDepartment: { dept_code: parentDeptCode },
                subDepartment: { dept_code: subDeptCode }
            };

            const result = await request('POST', `/employee/registDeptRelations`, headers, requestData);

            console.log('callRegistDeptRelationsAPI : ', result);

            if (result && result.status === 201) {

                dispatch(success());
                dispatch(callDepartmentsAPI());
            }
        } catch (error) {
            console.error('부서관계 등록 실패 : ', error)
        }
    };
};

export const callDeleteDeptRelationsAPI = (parentDeptCode, subDeptCode) => {

    return async (dispatch, getState) => {
        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const requestData = {
                parentDepartment: { dept_code: parentDeptCode },
                subDepartment: { dept_code: subDeptCode }
            };

            const result = await request('DELETE', `/employee/deleteDeptRelations`, headers, requestData);

            console.log('callDeleteDeptRelationsAPI : ', result);

            if (result && result.status === 204) {

                dispatch(success());
                dispatch(callDepartmentsAPI());
            }
        } catch (error) {
            console.error('부서관계 삭제 실패', error)
        }
    };
};

export const callModifyDeptRelationsAPI = (parentDeptCode, subDeptCode, deptRelationsCode) => {

    return async (dispatch, getState) => {
        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const requestData = {
                parentDepartment: { dept_code: parentDeptCode },
                subDepartment: { dept_code: subDeptCode }
            };

            const result = await request('PUT', `/employee/modifyDeptRelations/${deptRelationsCode}`, headers, requestData);

            console.log('callModifyDeptRelationsAPI : ', result);

            if (result && result.status === 201) {

                dispatch(success(result.data));
                dispatch(callDepartmentsAPI());

            }

        } catch (error) {
            console.error('부서관계 수정 실패 : ', error)
        }
    };
};

export const callResetPasswordAPI = (empCode) => {

    return async (dispatch, getState) => {
        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const result = await request('PUT', `/employee/resetEmpPass/${empCode}`, headers);

            console.log('callResetPasswordAPI : ', result);

            if (result && result.status === 201) {

                console.log('Dispatching successResetPass with data: ', result.data);

                dispatch(success(result.data));
                // dispatch(callDepartmentEmployeesAPI());
            } else {
                console.log('비밀번호 초기화 실패(result)', result);
            }
        } catch (error) {
            console.error('비밀번호 초기화 실패(error) ', error);
        }
    };
};

export const callTeamRecordCardAPI = (empCode) => {

    return async (dispatch, getState) => {
        try {

            const accessToken = localStorage.getItem('access-token');

            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const result = await request('GET', `/employee/teamRecordCard/${empCode}`, headers);

            console.log('callTeamRecordCardAPI : ', result);

            if (result && result.status === 200) {

                console.log('Dispatching getRecordcard with data: ', result);

                dispatch(getTeamRecordcard(result.data));

            } else {
                console.log('팀원 인사기록카드 조회 실패(result)', result)
            }
        } catch (error) {
            console.error('팀원 인사기록카드 조회 실패(eroor)', error)
        }
    };
};

export const callRegistEmployeesAPI = (employeesData) => {
    return async (dispatch, getState) => {
        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            console.log('Sending Payload employeesData:', employeesData);

            const result = await request('POST', '/employee/empsRegist', headers, employeesData);

            console.log('callRegistEmployeeAPI result : ', result);

            if (result && result.status === 201) {
                console.log('사원 등록 성공:', result.data);
                dispatch(registEmployees(result.data)); // 등록 성공 시 리듀서에 액션 디스패치
                alert('사원이 성공적으로 등록되었습니다.');
            } else {
                console.log('사원 등록 실패:', result);
                alert('사원 등록 중 오류가 발생하였습니다. result');
            }
        } catch (error) {
            console.error('사원 등록 실패:', error);
            if (error.response) {
                console.error('Server Response:', error.response.data);
            }
            alert('사원 등록 중 오류가 발생하였습니다. error');
        }
    };
};


export const callRegistEmpListAPI = () => {

    return async (dispatch, getState) => {

        try {
            const result = await request('GET', '/employee/empsResgistList');

            console.log('callRegistEmpListAPI result : ', result);

            if (result && result.status === 200) {

                dispatch(getRegistEmpList(result.data));

            } else {
                console.log('인사등록 리스트 조회 실패 result', result);
            }
        } catch (error) {
            console.error('인사등록 리스트 조회 실패 error', error);
        }
    };
};

export const callRegistEmpListDetailAPI = (erdNum) => {

    return async (dispatch, getState) => {

        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const result = await request('GET', `/employee/empsRegistListDetail/${erdNum}`, headers);

            console.log('callRegistEmpListDetailAPI result : ', result);

            if (result && result.status === 200) {

                console.log('Dispatching getRegistEmpListDetail with data: ', result);

                dispatch(getRegistEmpListDetail(result.data));

            } else {
                console.log('인사등록 리스트 상세 조회 실패 result', result);
            }
        } catch (error) {
            console.error('인사등록 리스트 상세 조회 실패 error', error);
        }
    };
};

export const callOrgChartAPI = () => {

    return async (dispatch, getStated) => {

        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };
            
            const result = await request('GET', '/employee/org', headers);
            
            console.log('callOrgChartAPI result : ', result);

            if (result && result.status === 200) {
                
                console.log('Dispatching getOrgChart with data: ', result.data);

                dispatch(getOrgChart(result.data));
                
            } else {
                console.log('조직도 조회 실패 result', result);
            }
        } catch (error) {
            console.error('조직도 조회 실패 error', error);
        }
    };
};

export const callRegistAppAPI = (registAppointsData) => {

    return async (dispatch, getState) => {

        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            console.log('Sending Payload registAppointData : ', registAppointsData);

            const result = await request('POST', '/employee/appRegist', headers, registAppointsData);

            console.log('callRegistAppAPI result : ', result);

            if (result && result.status === 201) {

                console.log('Dispatching registApp with data : ', result.data);

                dispatch(registAppoints(result.data));

            } else {
                console.log('발령 등록 실패 result', result);
            }
        } catch (error) {
            console.error('발령등록 실패 error', error);
        }
    };
};


export const callPositionsAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/employee/empPositions',);

            if(result && result.status === 200) {

                dispatch(getPositions(result.data));

            } else {

                console.log('직급목록 조회 실패(result): ', result);
            }
        } catch(error) {
            console.error('직급목록 조회 실패(error): ', error);
        }
    }
}

export const callRegistAppListAPI = () => {

    return async (dispatch, getState) => {

        try {

            const result = await request('GET', '/employee/appRegistList');

            console.log('callRegistAppListAPI result : ', result);

            if (result && result.status === 200) {

                console.log('Dispatching registAppList with data : ', result.data);

                dispatch(getRegistAppList(result.data));

            } else {
                console.log('발령등록 리스트 조회 실패 result', result);
            }
        } catch (error) {
            console.error('발령등록 리스트 조회 실패 error', error);
        }
    };
};

export const callRegistAppListDetailAPI = (aappNo) => {

    return async (dispatch, getState) => {

        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            const result = await request('GET', `/employee/appRegistListDetail/${aappNo}`, headers);

            if(result && result.status === 200) {

                console.log('Dispatching registAppListDetail with data : ', result.data)

                dispatch(getRegistAppListDetail(result.data));

            } else {
                console.log('발령등록 리스트 상세조회 실패 result', result);
            }
        } catch (error) {
            console.error('발령등록 리스트 상세조회 실패 error', error);
        }
    };
};

export const callUploadProfileImgAPI = (formData) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch('/employee/uploadProfileImg', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                dispatch(uploadProfileImg(result.data));
            } else {
                console.error('프로필 이미지 업로드 실패 : ', response);
            }
        } catch (error) {
            console.error('프로필 이미지 업로드 실패 : ', error);
        }
    };
};

export const callGetProfileImgAPI = (empCode) => {
    return async (dispatch, getState) => {
        try {
            const accessToken = localStorage.getItem('access-token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`
            };

            const response = await fetch(`http://localhost:8080/employee/profileImg?empCode=${empCode}`, {
                headers: headers
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                dispatch(getProfileImg(imageUrl));
            } else {
                console.error('프로필이미지 조회 실패:', response.status);
            }
        } catch (error) {
            console.error('프로필 이미지 조회 실패:', error);
        }
    };
};
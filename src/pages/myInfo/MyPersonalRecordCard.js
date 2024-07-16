// import '../../css/personal.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callRecordCardAPI, callRegistRecordCardAPI, callUpdateRecordCardAPI } from '../../apis/EmployeeAPICalls';

function MyPersonalRecordCard() {

    const dispatch = useDispatch();

    // Redux state에서 recordCard 데이터 가져오기
    const recordCard = useSelector(state => state.employeeReducer.recordCard);

    // 로컬 상태 설정
    const [schoolInfos, setSchoolInfos] = useState([]);
    const [certificates, setCertificates] = useState([]);

    // useEffect를 이용해 인사기록카드 정보 불러오기
    useEffect(() => {
        dispatch(callRecordCardAPI());
    }, [dispatch]);

    // recordCard 데이터가 변경될 때 로컬 상태 업데이트
    useEffect(() => {
        if (recordCard && recordCard.schoolInfos) {
            setSchoolInfos(recordCard.schoolInfos);
        }
        if (recordCard && recordCard.certificates) {
            setCertificates(recordCard.certificates);
        }
    }, [recordCard]);

    // 학력사항 행 추가
    const addSchoolInfoRow = () => {
        setSchoolInfos([...schoolInfos, { sch_name: '', grad_status: '', enrole_date: '', grad_date: '', major: '', day_n_night: '', location: '' }]);
    };

    // 자격증 행 추가
    const addCertificateRow = () => {
        setCertificates([...certificates, { cer_name: '', cer_score: '', cer_date: '', cer_num: '', iss_organ: '' }]);
    };

    // 입력 필드 변경 핸들러
    const handleSchoolInfoChange = (index, field, value) => {
        const updatedSchoolInfos = [...schoolInfos];
        updatedSchoolInfos[index][field] = value;
        setSchoolInfos(updatedSchoolInfos);
    };

    const handleCertificateChange = (index, field, value) => {
        const updatedCertificates = [...certificates];
        updatedCertificates[index][field] = value;
        setCertificates(updatedCertificates);
    };

    // 저장 버튼 클릭 핸들러
    const handleSave = () => {
        // 서버에 데이터 저장 API 호출
        const dataToSave = {
            schoolInfos,
            certificates
            // 다른 필요한 데이터 추가 가능
        };
        dispatch(callRegistRecordCardAPI(dataToSave));
    };

    return (
        <div class="ly_cont">
            <div class="ly_spaceBetween ly_fitemEnd hp_mb30">
                <h4 class="el_lv1Head">인사기록카드</h4>
                <div>
                    <button type="button" class="el_btnS el_btnblueBack" onClick={handleSave} >저장</button>
                    <button type="button" class="el_btnS el_btn0Bord">출력하기</button>
                </div>
            </div>
            <section class="bl_sect hp_padding15">
                <h5 class="hp_fw700 hp_fs18 hp_mb10">기본정보</h5>
                <table class="bl_tb3">
                    <colgroup>
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "*" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "*" }} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th rowspan="3">사진</th>
                            <th scope="row">이름</th>
                            <td>{recordCard.emp_name}</td>
                            <th scope="row">주민등록번호</th>
                            <td>{recordCard.social_security_no}</td>
                        </tr>
                        <tr>
                            <th scope="row">휴대폰</th>
                            <td>{recordCard.phone}</td>
                            <th scope="row">이메일</th>
                            <td>{recordCard.email}</td>
                        </tr>
                        <tr>
                            <th scope="row">주소</th>
                            <td colspan="3">{recordCard.address}</td>
                        </tr>
                    </tbody>
                </table>
                <h5 class="hp_fw700 hp_fs18 hp_mb10 hp_mt30">발령내역</h5>
                <table class="bl_tb3">
                    <colgroup>
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">발령일</th>
                            <th scope="col">발령유형</th>
                            <th scope="col">발령명</th>
                            <th scope="col">소속</th>
                            <th scope="col">직급</th>
                            <th scope="col">고용구분</th>
                            <th scope="col">근무지</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'center' }}></td>
                            <td style={{ textAlign: 'center' }}></td>
                            <td style={{ textAlign: 'center' }}></td>
                            <td style={{ textAlign: 'center' }}></td>
                            <td style={{ textAlign: 'center' }}></td>
                            <td style={{ textAlign: 'center' }}></td>
                            <td style={{ textAlign: 'center' }}></td>
                        </tr>
                    </tbody>
                </table>
                <h5 class="hp_fw700 hp_fs18 hp_mb10 hp_mt30">경력사항</h5>
                <table class="bl_tb3">
                    <colgroup>
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">입사일</th>
                            <th scope="col">퇴사일</th>
                            <th scope="col">직장명</th>
                            <th scope="col">담당업무</th>
                            <th scope="col">직급</th>
                            <th scope="col" colspan="2">퇴사사유</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input style={{ textAlign: 'center' }} /></td>
                            <td><input style={{ textAlign: 'center' }} /></td>
                            <td><input style={{ textAlign: 'center' }} /></td>
                            <td><input style={{ textAlign: 'center' }} /></td>
                            <td><input style={{ textAlign: 'center' }} /></td>
                            <td colspan="2"><input style={{ textAlign: 'center', width: "416px" }} /></td>
                        </tr>
                    </tbody>
                </table>
                <div class="ly_spaceBetween ly_fitemC hp_mt30 hp_mb10">
                    <h5 class="hp_fw700 hp_fs18 hp_mb10 hp_mt30">학력사항</h5>
                    <div class="">
                        <button type="button" class="el_btnS el_btn8Bord" onClick={addSchoolInfoRow} >추가</button>
                    </div>
                </div>
                <table class="bl_tb3">
                    <colgroup>
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                        <col style={{ width: "calc(100% / 7)" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">학교명</th>
                            <th scope="col">졸업여부</th>
                            <th scope="col">입학일</th>
                            <th scope="col">졸업일</th>
                            <th scope="col">전공</th>
                            <th scope="col">주야</th>
                            <th scope="col">소재지</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordCard && recordCard.schoolInfos.map((schoolInfo, index) => (
                            <tr key={index}>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.sch_name} onChange={(e) => handleSchoolInfoChange(index, 'sch_name', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.grad_status} onChange={(e) => handleSchoolInfoChange(index, 'grad_status', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.enrole_date} onChange={(e) => handleSchoolInfoChange(index, 'enrole_date', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.grad_date} onChange={(e) => handleSchoolInfoChange(index, 'grad_date', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.major} onChange={(e) => handleSchoolInfoChange(index, 'major', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.day_n_night} onChange={(e) => handleSchoolInfoChange(index, 'day_n_night', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.location} onChange={(e) => handleSchoolInfoChange(index, 'location', e.target.value)} /></td>
                            </tr>
                        ))}
                        {schoolInfos.map((schoolInfo, index) => (
                            <tr key={index}>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.sch_name} onChange={(e) => handleSchoolInfoChange(index, 'sch_name', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.grad_status} onChange={(e) => handleSchoolInfoChange(index, 'grad_status', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.enrole_date} onChange={(e) => handleSchoolInfoChange(index, 'enrole_date', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.grad_date} onChange={(e) => handleSchoolInfoChange(index, 'grad_date', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.major} onChange={(e) => handleSchoolInfoChange(index, 'major', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.day_n_night} onChange={(e) => handleSchoolInfoChange(index, 'day_n_night', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={schoolInfo.location} onChange={(e) => handleSchoolInfoChange(index, 'location', e.target.value)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div class="ly_spaceBetween ly_fitemC hp_mt30 hp_mb10">
                    <h5 class="hp_fw700 hp_fs18">자격증</h5>
                    <div class="">
                        <button type="button" class="el_btnS el_btn8Bord" onClick={addCertificateRow} >추가</button>
                    </div>
                </div>
                <table class="bl_tb3">
                    <colgroup>
                        <col style={{ width: "calc(100% / 5)" }} />
                        <col style={{ width: "calc(100% / 5)" }} />
                        <col style={{ width: "calc(100% / 5)" }} />
                        <col style={{ width: "calc(100% / 5)" }} />
                        <col style={{ width: "calc(100% / 5)" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">자격증 명</th>
                            <th scope="col">급수(점수)</th>
                            <th scope="col">취득일</th>
                            <th scope="col">자격증 번호</th>
                            <th scope="col">발행기관</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificates.map((certificate, index) => (
                            <tr key={index}>
                                <td><input style={{ textAlign: 'center' }} type="text" value={certificate.cer_name} onChange={(e) => handleCertificateChange(index, 'cer_name', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={certificate.cer_score} onChange={(e) => handleCertificateChange(index, 'cer_score', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={certificate.cer_date} onChange={(e) => handleCertificateChange(index, 'cer_date', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={certificate.cer_num} onChange={(e) => handleCertificateChange(index, 'cer_num', e.target.value)} /></td>
                                <td><input style={{ textAlign: 'center' }} type="text" value={certificate.iss_organ} onChange={(e) => handleCertificateChange(index, 'iss_organ', e.target.value)} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    )
}
export default MyPersonalRecordCard;
// import '../../css/personal.css';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callTeamRecordCardAPI } from '../../apis/EmployeeAPICalls';

function PersonalRecordCard({empCode}){

    const dispatch = useDispatch();

    const teamRecordCard = useSelector(state => state.employeeReducer.teamRecordCard);

    console.log('TeamRecordCard in component: ', teamRecordCard);

    useEffect(() => {
        if(empCode) {
            dispatch(callTeamRecordCardAPI(empCode));         
        }
    }, [dispatch]);

    return(
        <div class="ly_cont">
            <div class="ly_spaceBetween ly_fitemEnd hp_mb30">
                <h4 class="el_lv1Head">인사기록카드</h4>
                <button type="button" class="el_btnS el_btn0Bord">출력하기</button>
            </div>
            <section class="bl_sect hp_padding15">
                <h5 class="hp_fw700 hp_fs18 hp_mb10">기본정보</h5>
                <table class="bl_tb3">
                    <colgroup>
                        <col style={{width: "150px"}} />
                        <col style={{width: "150px"}} />
                        <col style={{width: "*"}} />
                        <col style={{width: "150px"}} />
                        <col style={{width: "*"}} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th rowspan="3">사진</th>
                            <th scope="row">이름</th>
                            <td>{teamRecordCard.emp_name}</td>
                            <th scope="row">주민등록번호</th>
                            <td>{teamRecordCard.social_security_no}</td>
                        </tr>
                        <tr>
                            <th scope="row">휴대폰</th>
                            <td>{teamRecordCard.phone}</td>
                            <th scope="row">이메일</th>
                            <td>{teamRecordCard.email}</td>
                        </tr>
                        <tr>
                            <th scope="row">주소</th>
                            <td colspan="3">{teamRecordCard.address}</td>
                        </tr>
                    </tbody>
                </table>
                <h5 class="hp_fw700 hp_fs18 hp_mb10 hp_mt30">발령내역</h5>
                <table class="bl_tb3">
                    <colgroup>
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
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
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
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
                            <td style={{ textAlign: 'center' }}></td>
                            <td style={{ textAlign: 'center' }}></td>
                            <td style={{ textAlign: 'center' }}></td>
                            <td style={{ textAlign: 'center' }}></td>
                            <td style={{ textAlign: 'center' }}></td>
                            <td colspan="2" style={{ textAlign: 'center', width: "416px" }}></td>
                        </tr>
                    </tbody>
                </table>
                <h5 class="hp_fw700 hp_fs18 hp_mb10 hp_mt30">학력사항</h5>
                <table class="bl_tb3">
                    <colgroup>
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
                        <col style={{width: "calc(100% / 7)"}} />
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
                        {teamRecordCard.schoolInfos && teamRecordCard.schoolInfos.map((school, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{school.sch_name}</td>
                                <td style={{ textAlign: 'center' }}>{school.grad_status}</td>
                                <td style={{ textAlign: 'center' }}>{school.enrole_date}</td>
                                <td style={{ textAlign: 'center' }}>{school.grad_date}</td>
                                <td style={{ textAlign: 'center' }}>{school.major}</td>
                                <td style={{ textAlign: 'center' }}>{school.day_n_night}</td>
                                <td style={{ textAlign: 'center' }}>{school.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div class="ly_spaceBetween ly_fitemC hp_mt30 hp_mb10">
                    <h5 class="hp_fw700 hp_fs18">자격증</h5>
                </div>
                <table class="bl_tb3">
                    <colgroup>
                        <col style={{width: "calc(100% / 5)"}} />
                        <col style={{width: "calc(100% / 5)"}} />
                        <col style={{width: "calc(100% / 5)"}} />
                        <col style={{width: "calc(100% / 5)"}} />
                        <col style={{width: "calc(100% / 5)"}} />
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
                        {teamRecordCard.certificates && teamRecordCard.certificates.map((cer, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }} >{cer.cer_name}</td>
                                <td style={{ textAlign: 'center' }} >{cer.cer_score}</td>
                                <td style={{ textAlign: 'center' }} >{cer.cer_date}</td>
                                <td style={{ textAlign: 'center' }} >{cer.cer_num}</td>
                                <td style={{ textAlign: 'center' }} >{cer.iss_organ}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    )
}
export default PersonalRecordCard;
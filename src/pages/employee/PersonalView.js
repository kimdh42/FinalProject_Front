// import '../../css/personal.css';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callRegistEmpListDetailAPI } from "../../apis/EmployeeAPICalls";
import { useParams } from "react-router";

function PersonalView() {

    const { erdNum } = useParams();

    const dispatch = useDispatch();

    const registEmpListDetail = useSelector(state => state.employeeReducer.registEmpListDetail);

    console.log('registEmpListDetail in component : ', registEmpListDetail);

    useEffect(() => {
        if (erdNum) {
            dispatch(callRegistEmpListDetailAPI(erdNum));
        }
    }, [dispatch, erdNum]);

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">인사내역</h4>
            <section className="bl_sect hp_padding15">
                <table className="bl_tb3">
                    <colgroup>
                        <col style={{ width: "120px" }} />
                        <col style={{ width: "*" }} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">인사번호</th>
                            <td>{registEmpListDetail.erd_num}</td>
                        </tr>
                        <tr>
                            <th scope="row">제목</th>
                            <td>{registEmpListDetail.erd_title}</td>
                        </tr>
                    </tbody>
                </table>
                <h5 className="hp_fw700 hp_fs18 hp_mt20">인사내용</h5>
                <div className="bl_sect hp_mt10">
                    <table className="bl_tb1">
                        <colgroup>
                            <col style={{ width: "50px" }} />
                            <col style={{ width: "130px" }} />
                            <col style={{ width: "130px" }} />
                            <col style={{ width: "150px" }} />
                            <col style={{ width: "150px" }} />
                            <col style={{ width: "150px" }} />
                            <col style={{ width: "130px" }} />
                            <col style={{ width: "130px" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col"><input type="checkbox" value="checkAll" />
                                </th>
                                <th scope="col">입사일</th>
                                <th scope="col">이름</th>
                                <th scope="col">주민등록번호</th>
                                <th scope="col">이메일</th>
                                <th scope="col">부서</th>
                                <th scope="col">직급</th>
                                <th scope="col">직책</th>
                            </tr>
                        </thead>
                        {/* <!-- 5개씩 나열 --> */}
                        <tbody>
                            {registEmpListDetail.empRegistDetailResponseList && registEmpListDetail.empRegistDetailResponseList.map((detail, index) => (
                                <tr key={index}>
                                    <th scope="row"><input type="checkbox" value="checkOne" /></th>
                                    <td>{detail.hire_date}</td>
                                    <td style={{ textAlign: 'center' }}>{detail.emp_name}</td>
                                    <td>{detail.social_security_no}</td>
                                    <td>{detail.email}</td>
                                    <td>{detail.dept_title}</td>
                                    <td>{detail.position_name}</td>
                                    <td>{detail.title_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="ly_spaceBetween ly_fitemC hp_mt10">
                    <div className="hp_ml10 hp_7Color">총 1 / <b className="hp_0Color hp_fw700">1</b> 페이지</div>
                    <select className="">
                        <option value="">정렬방식</option>
                    </select>
                </div>
                <section className="bl_sect hp_mt10 hp_padding5" style={{ textAlign: 'center' }}>
                    <div className="bl_paging">
                        <a className="bl_paging__btn bl_paging__first" href="" title="첫 페이지로 이동"></a>
                        <a className="bl_paging__btn bl_paging__prev" href="" title="이전 페이지로 이동"></a>
                        <a className="bl_paging__btn bl_paging__num" href="">1</a>
                        <a className="bl_paging__btn bl_paging__next" href="" title="다음 페이지로 이동"></a>
                        <a className="bl_paging__btn bl_paging__last" href="" title="마지막 페이지로 이동"></a>
                    </div>
                </section>
            </section>
        </div>
    )
}
export default PersonalView;
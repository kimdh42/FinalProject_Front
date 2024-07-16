// import '../../css/personal.css';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { callRegistAppListDetailAPI } from "../../apis/EmployeeAPICalls";

function AppointView() {

    const { aappNo } = useParams();

    const dispatch = useDispatch();

    const registAppListDetail = useSelector(state => state.employeeReducer.registAppListDetail);

    console.log('registAppListDetail 컴포넌트 : ', registAppListDetail);

    useEffect(() => {
        if (aappNo) {
            dispatch(callRegistAppListDetailAPI(aappNo));
        }
    }, [dispatch, aappNo]);

    return (
        <div class="ly_cont">
            <h4 class="el_lv1Head hp_mb30">발령내용</h4>
            <section class="bl_sect hp_padding15">
                <table class="bl_tb3">
                    <colgroup>
                        <col style={{ width: "120px" }} />
                        <col style={{ width: "*" }} />
                    </colgroup>
                    <tbody>
                        {registAppListDetail && registAppListDetail.length > 0 && (
                            <>
                                <tr>
                                    <th scope="row">발령번호</th>
                                    <td>{registAppListDetail[0].aappNo}</td>
                                </tr>
                                <tr>
                                    <th scope="row">제목</th>
                                    <td>{registAppListDetail[0].aappTitle}</td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
                <h5 class="hp_fw700 hp_fs18 hp_mt20">발령상세내용</h5>
                <div class="bl_sect hp_mt10">
                    <table class="bl_tb1">
                        <colgroup>
                            <col style={{ width: "50px" }} />
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "120px" }} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col"><input type="checkbox" class="" id="" name="" value="checkAll" />
                                </th>
                                <th scope="col">발령일</th>
                                <th scope="col">이름</th>
                                <th scope="col">발령종류</th>
                                <th scope="col">발령 전</th>
                                <th scope="col">발령 후</th>
                            </tr>
                        </thead>
                        {/* <!-- 5개씩 나열 --> */}
                        <tbody>
                            {registAppListDetail && registAppListDetail.map((detail, index) => (
                                <tr key={index}>
                                    <th scope="row"><input type="checkbox" class="" id="" name="" value="checkOne" />
                                    </th>
                                    <td>{detail.aappDate}</td>
                                    <td>{detail.empName}</td>
                                    <td>{detail.adetType}</td>
                                    <td>{detail.adetBefore}</td>
                                    <td>{detail.adetAfter}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div class="ly_spaceBetween ly_fitemC hp_mt10">
                    <div class="hp_ml10 hp_7Color">총 1 / <b class="hp_0Color hp_fw700">1</b> 페이지</div>
                    <select class="">
                        <option value="">정렬방식</option>
                    </select>
                </div>
                <section class="bl_sect hp_mt10 hp_padding5" style={{ textAlign: 'center' }}>
                    <div class="bl_paging">
                        <a class="bl_paging__btn bl_paging__first" href="" title="첫 페이지로 이동"></a>
                        <a class="bl_paging__btn bl_paging__prev" href="" title="이전 페이지로 이동"></a>
                        <a class="bl_paging__btn bl_paging__num" href="">1</a>
                        <a class="bl_paging__btn bl_paging__next" href="" title="다음 페이지로 이동"></a>
                        <a class="bl_paging__btn bl_paging__last" href="" title="마지막 페이지로 이동"></a>
                    </div>
                </section>
            </section>
        </div>
    )
}
export default AppointView;
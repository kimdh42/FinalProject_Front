// import '../../css/personal.css';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callRegistEmpListAPI } from "../../apis/EmployeeAPICalls";
import { Link, useHistory, useNavigate } from "react-router-dom";

function PersonalList() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const registEmpList = useSelector(state => state.employeeReducer.registEmpList);
    const [selectErdNum, setSelectErdNum] = useState(null);

    useEffect(() => {
        dispatch(callRegistEmpListAPI());
    }, [dispatch]);

    const handleRowClick = (erdNum) => {
        navigate(`/employee/personalView/${erdNum}`);
    }


    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">인사내역</h4>
            <div className="ly_spaceBetween">
                <button type="button" className="el_btnS el_btnblueBack" onClick={() => { window.location.href = 'personalRegist' }}>등록</button>
                <form action="" method="">
                    <input type="text" className="" id="" name="" placeholder="검색어를 입력해주세요" />
                    <input type="submit" className="el_btnS el_btnblueBord hp_ml5" id="" name="" value="검색" />
                </form>
            </div>
            <section className="bl_sect hp_mt10">
                <table className="bl_tb1">
                    <colgroup>
                        <col style={{ width: "50px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "*" }} />
                        <col style={{ width: "120px" }} />
                        <col style={{ width: "120px" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col"><input type="checkbox" className="" id="" name="" value="checkAll" /></th>
                            <th scope="col">인사번호</th>
                            <th scope="col">제목</th>
                            <th scope="col">작성자</th>
                            <th scope="col">등록일</th>
                        </tr>
                    </thead>
                    {/* <!-- 15개씩 나열 --> */}
                    <tbody>
                        {registEmpList && registEmpList.map((empList) => (
                            <tr key={empList.erd_code} onClick={() => handleRowClick(empList.erd_num)}>
                                <th scope="row"><input type="checkbox" value="checkOne" /></th>
                                <td>{empList.erd_num}</td>
                                <td style={{ textAlign: 'center' }}>{empList.erd_title}</td>
                                <td>{empList.erd_writer}</td>
                                <td>{empList.erd_registdate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <div className="ly_spaceBetween ly_fitemC hp_mt10">
                <div className="hp_ml10 hp_7Color">총 1 / <b className="hp_0Color hp_fw700">1</b> 페이지</div>
                <select className="">
                    <option value="">정렬방식</option>
                </select>
            </div>
            <section className="bl_sect hp_mt10 hp_padding5 hp_alignC" style={{ textAlign: 'center' }}>
                <div className="bl_paging">
                    <a className="bl_paging__btn bl_paging__first" href="" title="첫 페이지로 이동"></a>
                    <a className="bl_paging__btn bl_paging__prev" href="" title="이전 페이지로 이동"></a>
                    <a className="bl_paging__btn bl_paging__num" href="">1</a>
                    <a className="bl_paging__btn bl_paging__next" href="" title="다음 페이지로 이동"></a>
                    <a className="bl_paging__btn bl_paging__last" href="" title="마지막 페이지로 이동"></a>
                </div>
            </section>
        </div>
    )
}
export default PersonalList;
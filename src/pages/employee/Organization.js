import { useDispatch, useSelector } from 'react-redux';
import '../../css/personal.css';
import { useEffect } from 'react';
import { callOrgChartAPI } from '../../apis/EmployeeAPICalls';
import OrgD3Tree from './orgChart/OrgD3Tree';

// npm install react-d3-tree

function Organization() {

    const dispatch = useDispatch();
    const orgChart = useSelector((state) => state.employeeReducer.orgChart);

    useEffect(() => {
        dispatch(callOrgChartAPI());
    }, [dispatch]);

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">조직도</h4>
            <section className="bl_sect" style={{ height: 'calc(100% - 30px - 42px)' }}>
                <OrgD3Tree data={orgChart} />
            </section>
            {/* <div className="bl_popBack">
                <div className="bl_popup">
                    <div className="bl_popWrap bl_profile">
                        <div className="bl_popHead ly_spaceBetween ly_fitemC">
                            <div className="hp_fs18">구성원 정보</div>
                            <button type="button" className="bl_popup__closeBtn"></button>
                        </div>
                        <div className="bl_profile__img hp_mt30"
                            style={{backgroundImage: `url('/images/icon/icon_myinfo.png')`}}></div>
                        <ul className="bl_profile__sect hp_mt30">
                            <li className="hp_fw700">홍길동</li>
                            <li className="">
                                <span className="bl_profile__tag">#시스템팀</span>
                                <span className="bl_profile__tag">#대리</span>
                                <span className="bl_profile__tag">#백엔드개발자</span>
                            </li>
                        </ul>
                        <div className="bl_profile__sect">
                            <a className="bl_profile__icon bl_profile__iconEmail" href="">hong1234@naver.com</a>
                            <a className="bl_profile__icon bl_profile__iconContact" href="">12345</a>
                        </div>
                        <button type="button"
                            className="el_btnS el_btn0Back hp_marginAuto hp_mb20 hp_mt10">쪽지보내기</button>
                    </div>
                </div>
            </div> */}
        </div>
    )
}
export default Organization;
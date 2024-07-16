import BinSetting from "./setting/BinSetting";
import ImpSetting from "./setting/ImpSetting";
import RevSetting from "./setting/RevSetting";
import SendSetting from "./setting/SendSetting";
import WorkSetting from "./setting/WorkSetting";

function SettingStor() {

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">보관함 관리</h4>
            <section className="bl_sect">
                <table className="bl_tb2">
                    <colgroup>
                        <col style={{width: "200px"}} />
                        <col style={{width:"*"}} />
                        <col style={{width:"200px"}} />
                        <col style={{width:"*"}} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="row">분류</th>
                            <th scope="row">쪽지함</th>
                            <th scope="row">상태 (안읽음/전체)</th>
                            <th scope="row">관리</th>
                        </tr>
                    </thead>
                    <tbody className="hp_alignC">
                        <RevSetting/>
                        <SendSetting/>
                        <ImpSetting/>
                        <WorkSetting/>
                        <tr>
                        </tr>
                        <BinSetting/>
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default SettingStor;
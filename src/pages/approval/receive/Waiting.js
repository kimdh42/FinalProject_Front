import { useNavigate } from "react-router";

function Waiting({data}){
    const navigate = useNavigate();
    let showBtn = true;

    return(
        <section className="bl_sect hp_mt10">
            <table className="bl_tb1">
                <colgroup>
                    <col style={{width:'50px'}}/>
                    <col style={{width:'120px'}}/>
                    <col style={{width:'120px'}}/>
                    <col style={{width:'*'}}/>
                    <col style={{width:'120px'}}/>
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col" className="hp_lh34px">No.</th>
                        <th scope="col">상신일</th>
                        <th scope="col">결재양식</th>
                        <th scope="col">제목</th>
                        <th scope="col">결재자</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((document, index) =>
                            <tr key={index} onClick={() => navigate(`/approval/view/${document.adCode}`, {state: {document, showBtn}})} key={document.adCode} className="hp_tr__click">
                                <th scope="row" className="hp_lh34px">{document.adCode}</th>
                                <td>{document.adReportDate}</td>
                                <td>{document.afName}</td>
                                <td className="hp_alignL">{document.adTitle}</td>
                                <td>{document.empName}</td>
                            </tr>
                        )
                    ) : (
                        <tr>
                            <td colSpan="5" className="hp_pt50 hp_pb50 hp_7Color">목록이 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    )
}
export default Waiting;
import { useNavigate } from "react-router";
import {useEffect, useState} from "react";

function Complete({data, setSelectedAdCodes}){
    const navigate = useNavigate();

    // 체크박스 관련 상태 및 함수
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [checkedRows, setCheckedRows] = useState({});

    const toggleSelectAll = () => {
        const newCheckedRows = {};
        if (!selectAllChecked) {
            data.forEach((doc) => {
                newCheckedRows[doc.adCode] = true;
            });
        }
        setCheckedRows(newCheckedRows);
        setSelectAllChecked(!selectAllChecked);
    };

    const toggleCheckbox = (adCode) => {
        const newCheckedRows = { ...checkedRows };
        newCheckedRows[adCode] = !newCheckedRows[adCode];
        setCheckedRows(newCheckedRows);
        setSelectAllChecked(false);
    };

    // 체크된 abCode 전달
    useEffect(() => {
        const selectedAdCodes = Object.keys(checkedRows).filter((adCode) => checkedRows[adCode]);
        setSelectedAdCodes(selectedAdCodes);
    }, [checkedRows, setSelectedAdCodes]);

    return(
        <section className="bl_sect hp_mt10">
            <table className="bl_tb1">
                <colgroup>
                    <col style={{width:'50px'}}/>
                    <col style={{width:'120px'}}/>
                    <col style={{width:'*'}}/>
                    <col style={{width:'120px'}}/>
                    <col style={{width:'120px'}}/>
                </colgroup>
                <thead>
                <tr>
                    <th scope="col"><input type="checkbox" checked={selectAllChecked} onChange={toggleSelectAll}/></th>
                    <th scope="col">결재양식</th>
                    <th scope="col">제목</th>
                    <th scope="col">최종결재자</th>
                    <th scope="col">완료일</th>
                </tr>
                </thead>
                <tbody>
                {data && data.length > 0 ? (
                    data.map((document, index) =>
                        <tr key={document.adCode} onClick={() => navigate(`/approval/view/${document.adCode}`, {state: {document}})} className="hp_tr__click">
                            <td><input type="checkbox" checked={checkedRows[document.adCode]}
                                       onChange={() => toggleCheckbox(document.adCode)}
                                       onClick={(e) => e.stopPropagation()}/></td>
                            <td>{document.afName}</td>
                            <td className="hp_alignL">{document.adTitle}</td>
                            <td>{document.empName}</td>
                            <td>{document.talDate}</td>
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
export default Complete;
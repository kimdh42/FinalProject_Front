import { useEffect, useState } from "react";

function Late({handleDetail, formRefs, writtenCont = {}}){
    const [exception, setException] = useState({});

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setException(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        handleDetail(exception);
    }, [exception]);

    // writtenCont 값이 있을 경우
    useEffect(()=>{
        if(writtenCont !== null && Object.keys(writtenCont).length > 0){
            setException(prev => ({
                ...prev,
                aattSort: writtenCont.aattSort,
                aattOccur: writtenCont.aattOccur,
                aattReason: writtenCont.aattReason,
            }));
        }
    },[writtenCont])

    return(
        <table className="bl_tb3 el_approvalTb3__th">
            <tbody>
                <tr>
                    <th scope="col">구분</th>
                    <td>
                        <select className="hp_w200px" name="aattSort" value={exception.aattSort || (writtenCont ? writtenCont.aattSort : '')} onChange={onChangeHandler} required ref={(el) => (formRefs.current['aattSort'] = el)}>
                            <option value=''>선택</option>
                            <option value="지각사유서">지각사유서</option>
                            <option value="출근시각 정정요청">출근시각 정정요청</option>
                            <option value="퇴근시각 정정요청">퇴근시각 정정요청</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="col">발생일</th>
                    <td><input type="date" className="hp_w200px" name="aattOccur" value={exception.aattOccur || (writtenCont ? writtenCont.aattOccur : '')} onChange={onChangeHandler} required ref={(el) => (formRefs.current['aattOccur'] = el)}/></td>
                </tr>
                <tr>
                    <th scope="col">사유</th>
                    <td><textarea rows="2" cols="20" wrap="hard" className="hp_w100" name="aattReason" value={exception.aattReason || (writtenCont ? writtenCont.aattReason : '')} onChange={onChangeHandler} required ref={(el) => (formRefs.current['aattReason'] = el)}></textarea></td>
                </tr>
            </tbody>
        </table>
    )
}
export default Late;
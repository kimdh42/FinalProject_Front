import { useEffect, useState } from "react";

function Apology({handleDetail, formRefs, writtenCont = {}}){
    const [exception, setException] = useState({});

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setException(prev => ({
            ...prev,
            [name]: value,
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
                aeCon: writtenCont.aeCon,
            }));
        }else{
            setException({});
        }
    },[writtenCont])

    return(
        <table className="bl_tb3 el_approvalTb3__th">
            <tbody>
                <tr>
                    <th scope="col">위반내용</th>
                    <td><textarea rows="2" cols="20" wrap="hard" className="hp_w100" name="aeCon" value={exception.aeCon || (writtenCont ? writtenCont.aeCon : '')} onChange={onChangeHandler} required ref={(el) => (formRefs.current['aeCon'] = el)}></textarea></td>
                </tr>
                <tr>
                    <th scope="col">서약서</th>
                    <td>
                        <div className="hp_padding30">
                            본인은 직원으로서 제 사규를 준수하고 맡은 바 책임과 의무를 다하여 성실히 복무하여야 함에도 불구하고 위와 같이 회사의 관련 규정을 위반하였는 바 이에 경위서를 제출하고 그에 따른 처벌을 감수하며 차후 본건을 계기로 과오의 재발이 없을 것임을 서약합니다.
                            <label className="hp_dpBlock hp_dBack hp_pl10 hp_mt30">
                            <input type="checkbox" name="agree" ref={(el) => (formRefs.current['agree'] = el)} /> 이에 동의합니다.
                            </label>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
export default Apology;
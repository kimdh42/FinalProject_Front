import { useEffect, useState } from "react";

function Resign({handleDetail, formRefs, writtenCont = {}}){
    const [exception, setException] = useState({});

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setException(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [apContact1, setApContact1] = useState('');
    const [apContact2, setApContact2] = useState('');
    const [apContact3, setApContact3] = useState('');

    useEffect(() => {
        if(writtenCont && Object.keys(writtenCont).length > 0){
            const [contact1 = '', contact2 = '', contact3 = ''] = writtenCont.apContact ? writtenCont.apContact.split('-') : ['', '', ''];
            setApContact1(contact1);
            setApContact2(contact2);
            setApContact3(contact3);

            setException({
                apEnd: writtenCont.apEnd || '',
                apContact: writtenCont.apContact || '',
                apReason: writtenCont.apReason || ''
            });
        }
    }, [writtenCont]);

    useEffect(() => {
        const formattedContact = `${apContact1}-${apContact2}-${apContact3}`;
        setException(prev => ({
            ...prev,
            apContact: formattedContact
        }));
    }, [apContact1, apContact2, apContact3]);

    const onContactChange = (e) => {
        const { name, value } = e.target;

        if(name === 'apContact1') setApContact1(value);
        if(name === 'apContact2') setApContact2(value);
        if(name === 'apContact3') setApContact3(value);
    };

    useEffect(() => {
        handleDetail(exception);
    }, [exception]);

    // 숫자 입력 길이 제한
    const maxLengthCheck = (e) => {
        if (e.target.value.length > e.target.maxLength) e.target.value = e.target.value.slice(0, e.target.maxLength);
    };

    // writtenCont 값이 있을 경우
    useEffect(()=>{
        if(writtenCont !== null && Object.keys(writtenCont).length > 0){
            setException(prev => ({
                ...prev,
                apEnd: writtenCont.apEnd,
                apContact: writtenCont.apContact,
                apReason: writtenCont.apReason
            }));
        }
    },[writtenCont])

    return(
        <table className="bl_tb3 el_approvalTb3__th">
            <tbody>
                <tr>
                    <th scope="col">퇴사일</th>
                    <td><input type="date" className="hp_w120px" name="apEnd" value={exception.apEnd || (writtenCont ? writtenCont.apEnd : '')} onChange={onChangeHandler} required ref={(el) => (formRefs.current['apEnd'] = el)} /></td>
                </tr>
                <tr>
                    <th scope="col">퇴사후 연락처</th>
                    <td>
                        <input type="number" maxLength="3" onInput={maxLengthCheck} className="hp_w70px" name="apContact1" value={apContact1} onChange={onContactChange} required ref={(el) => (formRefs.current['apContact1'] = el)} /> -
                        <input type="number" maxLength="4" onInput={maxLengthCheck} className="hp_w70px" name="apContact2" value={apContact2} onChange={onContactChange} required ref={(el) => (formRefs.current['apContact2'] = el)} /> -
                        <input type="number" maxLength="4" onInput={maxLengthCheck} className="hp_w70px" name="apContact3" value={apContact3} onChange={onContactChange} required ref={(el) => (formRefs.current['apContact3'] = el)} />
                    </td>
                </tr>
                <tr>
                    <th scope="col">사유</th>
                    <td><textarea rows="2" cols="20" wrap="hard" className="hp_w100" name="apReason" value={exception.apReason || (writtenCont ? writtenCont.apReason : '')} onChange={onChangeHandler} required ref={(el) => (formRefs.current['apReason'] = el)}></textarea></td>
                </tr>
                <tr>
                    <th scope="col">서약서</th>
                    <td>
                        <div className="hp_padding30">
                            본인은 위와 같은 사유로 퇴사함에 있어 아래 조항을 성실히 준수할 것을 서약합니다.
                            <ol className="bl_listNum hp_mt20">
                                <li className="hp_mb10">본인은 퇴직에 따른 사무 인수, 인계의 철저로 최종 퇴사시까지 책임과 의무를 완수하고, 재직시 알게된 업무상 회사의 주요 정보 및 제반 비밀사항을 타인에게 누설함이 귀사의 경영에 막대한 손해와 피해를 준다는 사실을 지각하고 일체 이를 누설하지 않겠습니다.</li>
                                <li className="hp_mb10">재직 중 지급받은 공구, 비품, 등 물품은 퇴직일 전일까지 반환하겠습니다.</li>
                                <li className="hp_mb10">기타 회사와 관련한 제반사항은 회사규정에 의거 퇴직일 전일까지 처리하겠습니다.</li>
                                <li className="hp_mb10">만일 본인이 상기 사항을 위반하였을 때에는 이유 여하를 막론하고 서약에 의거 민, 형사상의 책임을 지며, 회사에서 요구하는 손해배상의 의무를 지겠습니다.</li>
                            </ol>
                            <label className="hp_dpBlock hp_dBack hp_pl10 hp_mt50">
                                <input type="checkbox" name="agree" ref={(el) => (formRefs.current['agree'] = el)} /> 이에 동의합니다.
                            </label>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
export default Resign;
function Share({data}){
    return (
        <section className="bl_sect hp_mt10">
            <table className="bl_tb1">
                <colgroup>
                    <col style={{width: '50px'}}/>
                    <col style={{width: '120px'}}/>
                    <col style={{width: '*'}}/>
                    <col style={{width: '120px'}}/>
                    <col style={{width: '120px'}}/>
                </colgroup>
                <thead>
                <tr>
                    <th scope="col"><input type="checkbox" className="" id="" name="" value="checkAll"/></th>
                    <th scope="col">결재양식</th>
                    <th scope="col">제목</th>
                    <th scope="col">작성자</th>
                    <th scope="col">완료일</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row"><input type="checkbox" className="" id="" name="" value="checkOne"/></th>
                    <td>휴가신청서</td>
                    <td className="hp_alignL">휴가신청서_홍길동</td>
                    <td>김철수</td>
                    <td>2024.12.34</td>
                </tr>
                </tbody>
            </table>
        </section>
    )
}

export default Share;
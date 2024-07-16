function ViewReference({referlines}){
    return (
        <>
            {referlines && referlines.length > 0 && (
                <>
                    <div className="ly_spaceBetween hp_mb10 hp_mt30">
                        <h5 className="hp_fw700 hp_fs18">참조/열람자</h5>
                    </div>
                    <div className="ly_flex hp_relative">
                        <table className="bl_tb3 hp_alignC hp_w200px ly_fshirnk">
                            <tbody>
                            <tr>
                                <th>구분</th>
                            </tr>
                            <tr>
                                <th>소속 / 직위</th>
                            </tr>
                            <tr>
                                <th>이름</th>
                            </tr>
                            </tbody>
                        </table>
                        {referlines.map((refer) => (
                            <table className="bl_tb3 hp_alignC ly_fgrow1" key={refer.emp_code}>
                                <tbody>
                                <tr>
                                    <th>{refer.talRole}자</th>
                                </tr>
                                <tr>
                                    <td>{refer.deptTitle} / {refer.titleName}</td>
                                </tr>
                                <tr>
                                    <td>{refer.empName}</td>
                                </tr>
                                </tbody>
                            </table>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default ViewReference;

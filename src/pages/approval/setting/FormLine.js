import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {callAllLineAPI} from "../../../apis/ApprovalAPICalls";
import {callsimpleDeptsAPI, callTitlesAPI} from "../../../apis/EmployeeAPICalls";

function FormLine({setNewForm, parentLsCode = null}){
    const dispatch = useDispatch();
    const { lines, departments, titles } = useSelector(state => ({
        lines: state.approvalReducer.lines,
        departments: state.employeeReducer.departments,
        titles: state.employeeReducer.titles,
    }));

    useEffect(() => {
        dispatch(callAllLineAPI());
    }, [dispatch]);

    useEffect(() => {
        dispatch(callsimpleDeptsAPI());
    }, [dispatch]);

    useEffect(() => {
        dispatch(callTitlesAPI());
    }, [dispatch]);

    // console.log("lines", lines);
    // console.log("departments", departments);
    // console.log("titles", titles);

    const getDeptTitle = (code) => {
        const dept = departments.find((dept) => dept.dept_code === code);
        return dept ? dept.dept_title : code;
    };

    const getTitleName = (code) => {
        const title = titles.find((title) => title.title_code === code);
        return title ? title.title_name : code;
    };

    const GroupedLabels = () => {
        // 그룹화
        const grouped = lines.reduce((acc, curr) => {
            const { lsCode, lsName, alOrder, alSort, alRole } = curr;
            if (!acc[lsName]) acc[lsName] = [];
            acc[lsName].push({ lsCode, alOrder, alSort, alRole });
            return acc;
        }, {});

        return (
            <>
                {Object.entries(grouped).map(([lsName, items]) => (
                    <label className="hp_dpBlock hp_mt10 hp_fs16" key={lsName}>
                        <input type="radio" name="lines" value={items[0].lsCode} onChange={() => handleRadioChange(items[0].lsCode)} checked={selectedLsCode === items[0].lsCode}/>
                        {lsName} : {" "}
                        {items
                            .sort((a, b) => a.alOrder - b.alOrder)
                            .map((item) => {
                                const sorts = item.alSort.split(", ");
                                const sortNames = sorts
                                    .map((sort) =>
                                        sort.startsWith("D")
                                            ? getDeptTitle(sort)
                                            : getTitleName(sort)
                                    )
                                    .join("/");
                                return `${sortNames}(${item.alRole})`;
                            })
                            .join(" - ")}
                    </label>
                ))}
            </>
        );
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOpenModal = () => {setIsModalOpen(true);};
    const handleCloseModal = () => {setIsModalOpen(false);};

    const [selectedLsCode, setSelectedLsCode] = useState(null);
    const handleRadioChange = (lsCode) => {
        setSelectedLsCode(lsCode);
    };

    // console.log("selectedLsCode", selectedLsCode);

    useEffect(() => {
        parentLsCode && setSelectedLsCode(parentLsCode);
    }, [parentLsCode]);

    useEffect(() => {
        setNewForm(prev => ({
            ...prev,
            lineSort: {
                lsCode: selectedLsCode
            }
        }));
    }, [selectedLsCode]);

    const filteredLines = selectedLsCode ? lines.filter((line) => line.lsCode === selectedLsCode) : [];

    return (
        <>
            <div className="ly_spaceBetween hp_mb10">
                <h5 className="hp_fw700 hp_fs18">결재라인</h5>
                <button type="button" className="el_btnS el_btn8Bord hp_p3-5" onClick={handleOpenModal}>결재라인 선택</button>
                {isModalOpen && (
                    <div className="bl_popBack">
                        <div className="bl_popup hp_w650px">
                            <div className="bl_popWrap bl_profile">
                                <div className="bl_popHead ly_spaceBetween ly_fitemC">
                                    <div className="hp_fs18">결재라인</div>
                                    <button type="button" className="bl_popup__closeBtn" onClick={handleCloseModal}></button>
                                </div>
                                <div className="hp_padding15 hp_alignC">
                                    <div className="hp_alignL">
                                        <GroupedLabels />
                                    </div>
                                    <button type="button" className="el_btnS el_btnblueBack hp_mt30" onClick={() => setIsModalOpen(false)}>확인</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="ly_flex hp_relative">
                <table className="bl_tb3 hp_alignC hp_w200px ly_fshirnk">
                    <tbody>
                    <tr>
                        <th>구분</th>
                    </tr>
                    <tr>
                        <th>소속</th>
                    </tr>
                    <tr>
                        <th>직위</th>
                    </tr>
                    </tbody>
                </table>
                {filteredLines.length === 0 ? (
                    <table className="bl_tb3 hp_alignC ly_fgrow1">
                        <tbody>
                        <tr>
                            <th></th>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                ) : (
                    filteredLines.map((line, index) => (
                        <table className="bl_tb3 hp_alignC ly_fgrow1" key={line.alOrder}>
                            <tbody>
                            <tr>
                                <th>{line.alRole}자</th>
                            </tr>
                            <tr>
                                <td>
                                    {line.alSort.includes("D") ? (
                                        line.alSort.split(", ").map((sort) => (
                                            sort.startsWith("D") && getDeptTitle(sort)
                                        ))
                                    ) : ("작성자 담당")}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {line.alSort.split(", ").map((sort) => (
                                        sort.startsWith("T") && (getTitleName(sort))
                                    ))}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    ))
                )}
            </div>
        </>
    )
}

export default FormLine;
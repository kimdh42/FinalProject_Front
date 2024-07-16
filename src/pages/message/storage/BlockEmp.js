import axios from "axios";
import React, { useEffect, useState } from "react";

function BlockEmp() {
    const [blockedEmp, setBlockedEmp] = useState([]);
    const [empSend, setEmpSend] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // 로그인한 사용자의 정보 추출
    useEffect(() => {
        const accessToken = localStorage.getItem('access-token');
        if (!accessToken) {
            // 로그인 정보가 없을 경우 처리 (예: 로그인 페이지로 리다이렉트)
            return;
        }

        fetch('http://localhost:8080/employee/myInfo', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            setEmpSend(data.emp_code);
        })
        .catch(error => console.log("error : ", error));
    }, []);

    // 차단 목록 및 선택 옵션 초기화
    useEffect(() => {
        if (empSend) {
            const savedEmps = JSON.parse(localStorage.getItem(`blockedEmp_${empSend}`)) || [];
            setBlockedEmp(savedEmps);
            const storedSelectedOptions = JSON.parse(localStorage.getItem(`selectedOptions_${empSend}`)) || [];
            setSelectedOptions(storedSelectedOptions);
        }
    }, [empSend]);

    // 회원 주소록 조회 및 옵션 설정
    useEffect(() => {
        if (empSend) {
            axios.get(`http://localhost:8080/emp/message/block/address?emp_code=${empSend}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                setOptions(res.data);
            })
            .catch(error => console.log("error : ", error));
        }
    }, [empSend]);

    // 행 추가
    const addRow = () => {
        const newBlockedEmp = [...blockedEmp, { member: '', date: '', blockDate: '', blkCode: '' }];
        setBlockedEmp(newBlockedEmp);
        const newSelectedOptions = [...selectedOptions, false];
        setSelectedOptions(newSelectedOptions);
        localStorage.setItem(`blockedEmp_${empSend}`, JSON.stringify(newBlockedEmp));
        localStorage.setItem(`selectedOptions_${empSend}`, JSON.stringify(newSelectedOptions));
    };

    // 행 삭제
    const deleteRow = (index) => {
        const blkCode = blockedEmp[index].blkCode; // 해당 행의 blkCode 추출

        // DELETE 요청
        axios.delete(`http://localhost:8080/emp/message/delete/${blkCode}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(() => {
            // 삭제 성공 시 행 제거
            const newBlockedEmp = blockedEmp.filter((_, i) => i !== index);
            setBlockedEmp(newBlockedEmp);
            const newSelectedOptions = selectedOptions.filter((_, i) => i !== index);
            setSelectedOptions(newSelectedOptions);
            localStorage.setItem(`blockedEmp_${empSend}`, JSON.stringify(newBlockedEmp));
            localStorage.setItem(`selectedOptions_${empSend}`, JSON.stringify(newSelectedOptions));
        })
        .catch(error => console.log("error : ", error));
    };

    // 차단 회원 등록
    const blockEmp = (blkId, blkName, index) => {
        const currentDate = new Date().toISOString().slice(0, 10);

        const data = {
            blkDate: currentDate,
            blkId: { emp_code: blkId },
            blkName: { emp_code: blkName }
        };

        axios.post('http://localhost:8080/emp/message/block', data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            alert("회원 차단 성공!");

            // 해당 행의 blockDate 업데이트
            const newBlockedEmp = [...blockedEmp];
            newBlockedEmp[index].blockDate = currentDate;
            setBlockedEmp(newBlockedEmp);

            // 차단 회원의 blkCode 조회
            return axios.get(`http://localhost:8080/emp/message/${blkId}/${blkName}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                    'Content-Type': 'application/json'
                }
            });
        })
        .then(res => {
            const blkCode = res.data.blkCode; // 서버 응답에서 blkCode 추출

            // 해당 행의 blkCode 업데이트
            const newBlockedEmp = [...blockedEmp];
            newBlockedEmp[index].blkCode = blkCode;
            setBlockedEmp(newBlockedEmp);

            // 선택된 회원 저장
            const newSelectedOptions = [...selectedOptions];
            newSelectedOptions[index] = true;
            setSelectedOptions(newSelectedOptions);

            // localStorage 업데이트
            localStorage.setItem(`blockedEmp_${empSend}`, JSON.stringify(newBlockedEmp));
            localStorage.setItem(`selectedOptions_${empSend}`, JSON.stringify(newSelectedOptions));
        })
        .catch(error => console.log("error : ", error));
    };

    // 차단 회원 선택 시 변경
    const empChangeHandler = (index, value) => {
        updateRow(index, 'member', value);
        blockEmp(empSend, value, index);
    };

    // 행의 선택 여부 업데이트
    const updateRow = (index, field, value) => {
        const newBlockedEmp = [...blockedEmp];
        newBlockedEmp[index][field] = value;
        setBlockedEmp(newBlockedEmp);

        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[index] = true;
        setSelectedOptions(newSelectedOptions);

        localStorage.setItem(`selectedOptions_${empSend}`, JSON.stringify(newSelectedOptions));
    };

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">차단 관리</h4>
            <section className="bl_sect">
                <table className="bl_tb2">
                    <colgroup>
                        <col style={{ width: "200px" }} />
                        <col style={{ width: "*" }} />
                        <col style={{ width: "*" }} />
                        <col style={{ width: "*" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="row">분류</th>
                            <th scope="row">차단 회원</th>
                            <th scope="row">차단 일자</th>
                            <th scope="row">관리</th>
                        </tr>
                    </thead>
                    <tbody className="hp_alignC">
                        <tr>
                            <th scope="row" rowSpan={10}>차단 회원 관리<br />
                                <button type="button" className="el_btnS el_btn8Bord hp_mt5" onClick={addRow}>+ 추가</button>
                            </th>
                        </tr>
                        {blockedEmp.map((row, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="ly_flex">
                                        <select
                                            style={{ width: "90%" }}
                                            value={row.member}
                                            onChange={(e) => empChangeHandler(index, e.target.value)}
                                            disabled={selectedOptions[index] || row.member !== ''}
                                        >
                                            <option value="" disabled={!selectedOptions[index]}>{selectedOptions[index] ? `${row.member} (차단됨)` : "차단 회원 선택"}</option>
                                            {options.length > 0 && options.map((option) => (
                                                <option key={option.emp_code} value={option.emp_code} disabled={selectedOptions[index] && option.emp_code === row.member}>
                                                    {option.emp_name} &lt;{option.dept_title} {option.position_name}&gt; ({option.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </td>
                                <td>
                                    <div className="ly_flex">
                                        <input
                                            type="text"
                                            className="hp_w100"
                                            value={row.blockDate}
                                            readOnly
                                        />
                                    </div>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="el_btnS el_btn8Back hp_ml5"
                                        onClick={() => deleteRow(index)}
                                    >
                                        차단 해제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default BlockEmp;

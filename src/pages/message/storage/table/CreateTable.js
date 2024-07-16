import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { callGetAttachmentListAPI } from "../../../../apis/MessageAPICalls";
import axios from "axios";

function CreateTable({msgCode}) {

    const [options, setOptions] = useState([]);
    const [selectEmpRev, setSelectEmpRev] = useState('');
    const [msgTitle, setMsgTitle] = useState('');
    const [msgCon, setMsgCon] = useState('');
    const [emerStatus, setEmerStatus] = useState('N');
    const [empSend, setEmpSend] = useState('');
    const [files, setFiles] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        if(location.state && location.state.msgTitle) {
            setMsgTitle(location.state.msgTitle);
        }

        if(location.state && location.state.msgCon) {
            setMsgCon(location.state.msgCon);
        }

        /* 회원 주소록 조회 */
        if(empSend) {
            axios.get(`http://localhost:8080/emp/message/block/address?emp_code=${empSend}`,{
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

        /* 로그인한 사용자의 정보 추출 */
        fetch('http://localhost:8080/employee/myInfo',{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
            }
        })
            .then(res => res.json())
            .then(data => setEmpSend(data.emp_code))
            .catch(error => console.log("error : ", error));

        /* 임시저장된 쪽지 데이터 불러오기 */
        if (msgCode) {
            fetch(`http://localhost:8080/emp/message/send/${msgCode}`)
                .then(res => res.json())
                .then(data => {
                    setMsgTitle(data.msgTitle);
                    setMsgCon(data.msgCon);
                    setSelectEmpRev(data.empRev);
                    setEmerStatus(data.emerStatus);
                })
                .catch(error => console.log("error : ", error));

            /* 임시저장한 파일 불러오기 */
            callGetAttachmentListAPI(msgCode)
                .then(data => {
                    if(Array.isArray(data)) {
                        const fileList = data.map(item => {
                            return new File([], item.attachOriginal, {
                                type: item.type,
                                lastModified: item.lastModified ? item.lastModified : Date.now(),
                                name: item.attachOriginal,
                                url: `${item.attachUrl}/${item.attachSave}`
                            });
                        });
                        setFiles(fileList);
                    } else {
                        console.log("첨부파일을 가져오지 못했습니다.");
                    }
                })
                .catch (error => {
                    console.log("오류 발생 : ", error);
                });
        }
    }, [location.state, msgCode, empSend]);

    /* 확인 버튼 처리 */
    const submitHandler = () => {

        /* 입력 예외처리 */
        if (!selectEmpRev || !msgTitle || !msgCon) {
            alert("받는 사람, 제목, 내용을 모두 입력해주세요.");
            return;
        }

        const confirmSend = window.confirm("쪽지를 보내시겠습니까?");
        if(!confirmSend) {
            return;
        }

        /* JSON 형식으로 INSERT */
        const data = {
            msgTitle,
            msgCon,
            msgStatus: 'N',
            emerStatus,
            empRev: { emp_code: selectEmpRev },
            empSend: { emp_code: empSend },
            revStor: { storCode: 1 },
            sendStor: { storCode: 1}
        };

        fetch('http://localhost:8080/emp/message/send', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            // 파일 저장하는 API 호출
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('files', file);
            });

            fetch('http://localhost:8080/emp/message/attach', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(attachData => {
                console.log("file insert success ", attachData);
            })
            .catch (error => {
                console.log("file insert fail : ", error);
            });


            if (msgCode) {
                // 임시 저장 쪽지 삭제
                fetch(`http://localhost:8080/emp/message/bin/${msgCode}`, {
                    method: 'DELETE'
                })
                .then(() => {
                    console.log('temp message insert success :', msgCode);
                })
                .catch(error => {
                    console.log("error : ", error);
                });
            }

            alert("쪽지를 성공적으로 보냈습니다.");
            navigate('/message/storage/receive');
        })
        .catch(error => {
            console.log("error : : ", error);
            alert("쪽지 전송에 실패하였습니다.");
        });
    };

    const fileChangeHandler = (e) => {
        setFiles(Array.from(e.target.files));
    }

    const removeFileHandler = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    }

    const cancelHandler = ( ) => { 
        const cancelConfirm = window.confirm("쪽지 쓰기를 취소하시겠습니까?");
        
        /* 취소한 경우 */
        if ( !cancelConfirm ) {
            return;
        }
    
        /* 취소 안한 경우 */
        if( selectEmpRev !== '' || msgTitle !== '' || msgCon !== '') {
    
            const tempConfirm = window.confirm("임시저장 하시겠습니까?");
            
            if (!tempConfirm) {
                navigate("/message/storage/receive");

            } else {

                /* 임시저장 하는 API fetch로 작성 */
                const data = {
                    msgTitle,
                    msgCon,
                    msgStatus: 'N',
                    emerStatus,
                    empRev: {emp_code: selectEmpRev },
                    empSend: {emp_code: empSend },
                    revStor: { storCode: 4},
                    sendStor: { storCode: 4}
                };

                fetch('http://localhost:8080/emp/message/create/temp', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(data => {
                    // 파일 저장하는 API 호출
                    const formData = new FormData();
                    Array.from(files).forEach(file => {
                        formData.append('files', file);
                    });

                    fetch('http://localhost:8080/emp/message/attach', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => res.json())
                    .then(attachData => {
                        console.log("file insert success : ", attachData);
                    })
                    .catch (error => {
                        console.log("file insert fail : ", error);
                    });

                    
                    alert("임시저장이 완료되었습니다.");
                    navigate("/message/storage/temp");
                })
                .catch(error => {
                    console.log("error : : ", error);
                });
            }
            
        } else {
            navigate("/message/storage/receive");
        }
    }

    return (
        <div>
            <table className="bl_tb3">
                <colgroup>
                    <col style={{ width: "120px" }} />
                    <col style={{ width: "*" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="col">받는사람</th>
                        <td>
                            <div className="ly_spaceBetween ly_fshirnk">
                                <select 
                                    style={{ width: "90%" }}
                                    value={selectEmpRev}
                                    onChange={(e) => setSelectEmpRev(e.target.value)}
                                >
                                    <option>인원 선택</option>
                                    {options.length > 0 && options.map((option, index) => (
                                        <option key={index} value={option.emp_code}>
                                            {option.emp_name} &lt;{option.dept_title} {option.position_name}&gt;  ({option.email})
                                        </option>
                                    ))}
                                </select>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value="urgent" 
                                        style={{ minHeight: "inherit" }}
                                        onChange={(e) => setEmerStatus(e.target.checked ? 'Y' : 'N')} 
                                        checked={emerStatus === 'Y'}
                                    /> 긴급
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="col">첨부파일</th>
                        <td>
                            <div className="ly_flex ly_fitemStart">
                                <ul className="hp_w100 hp_mr10">
                                    {Array.isArray(files) && files.map((file, index) => (
                                        <li key={index}>
                                            <button type="button" className="hp_mr10 hp_fw700" onClick={() => removeFileHandler(index)} title="삭제">X</button>
                                            {file.name}
                                        </li>
                                    ))}
                                </ul>
                                <label className="bl_attachBtn__label el_btnS el_btn8Back hp_p3-5">
                                    <input
                                        type="file"
                                        multiple
                                        className="bl_attachBtn__input"
                                        onChange={fileChangeHandler}
                                    /> 파일선택
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr style={{ height: "70px" }}>
                        <th scope="col">제목</th>
                        <td>
                            <input 
                                type="text" 
                                style={{ height: "70px" }} 
                                className="hp_w100" 
                                placeholder="100자 이내로 입력해주세요."
                                value={msgTitle}
                                onChange={(e) => setMsgTitle(e.target.value)} 
                            />
                        </td>
                    </tr>
                    <tr style={{ height: "500px" }}>
                        <th scope="col">내용</th>
                        <td>
                            <textarea 
                                className="hp_w100"
                                style={{ height: "500px" }} 
                                placeholder="1000자 이내로 입력해주세요."
                                value={msgCon}
                                onChange={(e) => setMsgCon(e.target.value)}
                        ></textarea></td>
                    </tr>
                </tbody>
            </table>
            <div className="hp_alignR hp_mt10">
                <button type="button" className="el_btnS el_btn8Back" onClick={cancelHandler}>취소</button>
                <button type="button" className="el_btnS el_btnblueBack hp_ml5" onClick={submitHandler}>보내기</button>
            </div>
        </div>
    );
}

export default CreateTable;
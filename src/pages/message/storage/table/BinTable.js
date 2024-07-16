import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callBinMsgListAPI, callMoveToImpAPI, callMoveToRevAPI, callMoveToWorkAPI } from "../../../../apis/MessageAPICalls";
import { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../paging/Pagination";

function BinTable({ currentPage, setCurrentPage }) {

    const dispatch = useDispatch();
    const messages = useSelector(state => state.messageReducer.binMessage.message);
    const [sort, setSort] = useState("desc");   // 쪽지 정렬 상태
    const [selectMsg, setSelectMsg] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);  // 전체 선택
    const itemsPerPage = 10;

    /* 날짜 포맷 함수 */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        
        return date.toISOString().split('T')[0];
    }

    /* 쪽지 배열 정렬 */
    const sortMsg = (messages, sort) => {

        if (!messages) {
            return [];
        }

        if (sort === "asc") {
            return messages.slice().sort((a, b) => new Date(a.sendDate) - new Date(b.sendDate));
        } else {
            return messages.slice().sort((a, b) => new Date(b.sendDate) - new Date(a.sendDate));
        }
    };


    const sortChangeHandler = (e) => {
        setSort(e.target.value);
    }

    const sortedMessages = sortMsg(messages, sort);

    useEffect(() => {
        dispatch(callBinMsgListAPI());        
    }, [dispatch]);

    /* DELETE 로직 구현 */
    const selectMsgHandler = (msgCode) => {
        setSelectMsg(prev => {
            const newSelect = new Set(prev);

            if(newSelect.has(msgCode)) {
                newSelect.delete(msgCode);
            } else {
                newSelect.add(msgCode);
            }
            return newSelect;
        });
    };

    /* 체크박스 전체 선택 */
    const selectAllHandler = (e) => {

        setSelectAll(e.target.checked);

        if(e.target.checked) {
            const allMsgCode = new Set(sortedMessages.map(msg => msg.msgCode));
            setSelectMsg(allMsgCode);
        } else{
            setSelectMsg(new Set());
        }

    }

    // Pagination
    const indexOfLastMessage = currentPage * itemsPerPage;
    const indexOfFirstMessage = indexOfLastMessage - itemsPerPage;
    const currentMessages = sortedMessages.slice(indexOfFirstMessage, indexOfLastMessage);

    const deleteMsgHandler = () =>{
        if(selectMsg.size === 0) {
            alert("삭제하실 쪽지를 선택해주세요.");
            return;
        }

        const deleteConfirm = window.confirm("쪽지를 삭제 하시겠습니까?");

        /* 완전삭제 취소 시 */
        if(!deleteConfirm) {
            return;
        }

        /* 삭제 로직 */
        selectMsg.forEach(msgCode => {
            fetch(`http://localhost:8080/emp/message/bin/${msgCode}`, {
                method: 'DELETE'
            })
                .then(res => {

                    if(res.ok) {
                        setSelectMsg(prev => {
                            const newSelect = new Set(prev);
                            newSelect.delete(msgCode);
                            return newSelect;
                        });

                        dispatch(callBinMsgListAPI());  // 쪽지 목록 재조회

                    } else {
                        console.log('메세지 삭제 실패 : ', msgCode);
                    }

                }).catch(error => console.log("error : ", error));
        });
    };

    /* 쪽지 복원 핸들러 */
    const moveMsgHandler = (e) => {
        const selectOption = e.target.value;

        if (selectOption === "받은 쪽지") {
            moveMsgToRevHandler();

        } else if (selectOption === "중요 보관함") {
            moveMsgToImpHandler();

        } else if (selectOption === "업무 보관함") {
            moveMsgToWorkHandler();
            
        }
    };

    /* 받은 쪽지 */
    const moveMsgToRevHandler = () => {

        if (selectMsg.size === 0) {
            alert("복원할 쪽지를 선택해주세요.");
            window.location.reload();
            return;
        }

        selectMsg.forEach((msgCode) => {
            dispatch(callMoveToRevAPI(msgCode));
        });
        window.location.reload();
    };

    /* 중요 보관함 */
    const moveMsgToImpHandler = () => {

        if (selectMsg.size === 0) {
            alert("복원할 쪽지를 선택해주세요.");
            window.location.reload();
            return;
        }

        selectMsg.forEach((msgCode) => {
            dispatch(callMoveToImpAPI(msgCode));
        });
        window.location.reload();
    };

    /* 업무 보관함 */
    const moveMsgToWorkHandler = () => {

        if (selectMsg.size === 0) {
            alert("복원할 쪽지를 선택해주세요.");
            window.location.reload();
            return;
        }

        selectMsg.forEach((msgCode) => {
            dispatch(callMoveToWorkAPI(msgCode));
        });
        window.location.reload();
    };

    return(
        <div>
            <div className="ly_spaceBetween">
                <div>
                    <button type="button" className="el_btnS el_btn8Back hp_mr5" onClick={deleteMsgHandler}>영구삭제</button>
                        <select className="el_btnS el_btn8Bord hp_mb5" onChange={moveMsgHandler}>
                            <option>복원</option>
                            <option>받은 쪽지</option>
                            <option>중요 보관함</option>
                            <option>업무 보관함</option>
                        </select>
                </div>
                <div>
                    <input type="text" placeholder="검색어를 입력해주세요" />
                    <input type="submit" className="el_btnS el_btnblueBord hp_ml5" value="검색" />
                </div>
            </div>
            <section className="bl_sect hp_mt10">
                <table className="bl_tb1">
                    <colgroup>
                        <col style={{ width: "90px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "120px" }} />
                        <col style={{ width: "120px" }} />
                        <col style={{ width: "*" }} />
                        <col style={{ width: "*" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col"><input type="checkbox" checked={selectAll} onChange={selectAllHandler} /></th>
                            <th scope="col">일자</th>
                            <th scope="col">보낸사람</th>
                            <th scope="col">받은사람</th>
                            <th scope="col">제목</th>
                            <th scope="col">긴급</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMessages && currentMessages.length > 0 ? (
                            currentMessages.map(msg => (
                            <tr key={msg.msgCode}>
                                <td>
                                    <input type="checkbox" checked={selectMsg.has(msg.msgCode)} onChange={() => selectMsgHandler(msg.msgCode)}/>
                                </td>
                                <td>{formatDate(msg.sendDate)}</td>
                                <td>{msg.sendName} {msg.sendPosition}</td>
                                <td>{msg.revName} {msg.revPosition}</td>
                                <td className="hp_alighL">
                                    <Link to={`/message/storage/bin/detail/${msg.msgCode}`}>{msg.msgTitle}</Link>
                                </td>
                                <td>
                                        {msg.emerStatus === 'Y' ? (
                                            <div>🚨</div>
                                        ) : (
                                            <div></div>
                                        )}</td>
                            </tr>
                            ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="hp_pt50 hp_pb50 hp_7Color">목록이 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
            <div className="ly_spaceBetween ly_fitemC hp_mt10">
                <div className="hp_ml10 hp_7Color"> {sortedMessages.length} / <b className="hp_0Color hp_fw700">1</b> 페이지</div>
                <select value={sort} onChange={sortChangeHandler}>
                    <option value="desc">정렬방식</option>
                    <option value="asc">날짜 오름차순</option>
                </select>
            </div>
            <section className="bl_sect hp_mt10 hp_padding5 hp_alignC">
                <Pagination messages={sortedMessages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </section>
        </div>
    );
}

export default BinTable;
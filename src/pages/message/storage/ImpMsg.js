import ImpTable from "./table/ImpTable";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef } from "react";
import { callDelMsgAPI, callMoveToRevAPI, callMoveToWorkAPI } from "../../../apis/MessageAPICalls";
import Pagination from "./paging/Pagination";

function ImpMsg() {

    const dispatch = useDispatch();
    const [selectMsgCode, setSelectMsgCode] = useState([]);
    const [search, setSearch] = useState("");   // 검색어 상태
    const searchRef = useRef(null); // 검색 입력 필드
    const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 상태
    const messages = useSelector((state) => state.messageReducer.impMessage.message);

    const delMsgHandler = () => {

        if (selectMsgCode.length === 0) {
            alert("삭제하실 쪽지를 선택해주세요.");
            return;
        }
        
        if ( window.confirm("메세지를 삭제하시겠습니까?")) {

            selectMsgCode.forEach(msgCode => {
                dispatch(callDelMsgAPI(msgCode));
            });
            
            alert("쪽지를 삭제하였습니다.");
            window.location.reload();   
        }
    };

    const searchHandler = (e) => {

        e.preventDefault();

        if (searchRef.current) {
            const searchTerm = searchRef.current.value;
            setSearch(searchTerm); 
        } else {
            console.log("searchRef가 정의되지 않음");
        }
    };

    // 보관함 이동 핸들러
    const moveMsgHandler = (e) => {
        const selectOption = e.target.value;
        
        if (selectOption === "받은 쪽지") {
            moveMsgToRevHandler();

        } else if (selectOption === "업무 보관함") {
            moveMsgToWorkHandler();
        }
    };

    // 받은 쪽지 이동 핸들러
    const moveMsgToRevHandler = () => {

        if (selectMsgCode.length === 0) {
            
            alert("이동시킬 쪽지를 선택해주세요.");
            window.location.reload();
            return;
        }

        selectMsgCode.forEach(msgCode => {
            dispatch(callMoveToRevAPI(msgCode));
        });
        window.location.reload();
    }

    // 업무 보관함 이동 핸들러
    const moveMsgToWorkHandler = () => {

        if (selectMsgCode.length === 0) {

            alert("이동시킬 쪽지를 선택해주세요.");
            window.location.reload();
            return;
        }

        selectMsgCode.forEach(msgCode => {
            dispatch(callMoveToWorkAPI(msgCode));
        });
        window.location.reload();
    }

    return (
        <div className="ly_body" style={{ width: "100%" }}>
            <div className="ly_cont">
                <h4 className="el_lv1Head hp_mb30">중요 보관함</h4>
                <div className="ly_spaceBetween">
                    <div className="ly_spaceBetween">
                        <button type="button" className="el_btnS el_btn8Back hp_mr5" onClick={delMsgHandler}>삭제</button>
                        <select className="el_btnS el_btn8Bord" onChange={moveMsgHandler}>
                            <option>이동</option>
                            <option>받은 쪽지</option>
                            <option>업무 보관함</option>
                        </select>
                    </div>
                    <div>
                        <form onSubmit={searchHandler}>
                            <input type="text" ref={searchRef} placeholder="검색어를 입력해주세요" />
                            <input type="submit" className="el_btnS el_btnblueBord hp_ml5" value="검색"/>
                        </form>
                    </div>
                </div>
                <ImpTable 
                    selectMsgCode={selectMsgCode} 
                    setSelectMsgCode={setSelectMsgCode} 
                    search={search} 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
                <section className="bl_sect hp_mt10 hp_padding5 hp_alignC">
                    <Pagination messages={messages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                </section>
            </div>
        </div>
    );
}

export default ImpMsg;
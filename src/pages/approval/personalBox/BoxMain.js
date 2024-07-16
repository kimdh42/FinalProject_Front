import PagingBar from "../../../components/commons/PagingBar";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {
    calldeleteDocInStorageAPI,
    calldeleteDocumentAPI,
    calldocListInStorageAPI, callregistBoxAPI
} from "../../../apis/ApprovalAPICalls";
import {useLocation} from "react-router-dom";

function BoxMain(){
    const navigate = useNavigate();
    const {abName} = useParams();
    const location = useLocation();
    const {abCode} = { ...location.state };
    const dispatch = useDispatch();
    const { documents } = useSelector(state => ({
        documents: state.approvalReducer.documents,
    }));

    useEffect(() => {
        abCode && dispatch(calldocListInStorageAPI(abCode));
    }, [abCode]);

    // console.log("documents", documents);

    // 검색
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {   // searchResults 초기값 설정
        setSearchResults(documents);
    }, [documents]);

    const handleSearch = (event) => {
        event.preventDefault();

        if (!searchTerm.trim()) {       // 검색어가 없는 경우, 모든 문서를 그대로 출력
            setSearchResults(documents);
        } else {                        // 검색어가 있는 경우, 검색어를 포함한 문서만 필터링하여 출력
            const filteredDocuments = documents.filter(doc => {
                return Object.values(doc).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setSearchResults(filteredDocuments);
        }
    };

    // console.log("searchResults", searchResults);

    // 정렬방식 추가
    const [sortOption, setSortOption] = useState('');

    const sortDocuments = (results, option) => {
        switch (option) {
            case '완료일':
                return results.slice().sort((a, b) => new Date(a.talDate) - new Date(b.talDate));
            case '결재양식':
                return results.slice().sort((a, b) => a.afName.localeCompare(b.afName));
            case '제목':
                return results.slice().sort((a, b) => a.adTitle.localeCompare(b.adTitle));
            default:
                return results;
        }
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setCurrentPage(1); // 정렬 방식 변경 시 첫 페이지로 초기화
    };

    // console.log("sortOption", sortOption);

    // 페이징
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 10;

    // 현재 페이지의 결과 계산
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;

    // 검색 결과에 정렬 적용
    const sortedSearchResults = sortDocuments(searchResults, sortOption);
    const currentResults = sortedSearchResults.slice(indexOfFirstResult, indexOfLastResult);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(searchResults.length / resultsPerPage);

    // 페이지 변경 함수
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    
    // 체크박스 관련 상태 및 함수
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [checkedRows, setCheckedRows] = useState({});

    const toggleSelectAll = () => {
        const newCheckedRows = {};
        if (!selectAllChecked) {
            documents.forEach((doc) => {
                newCheckedRows[doc.adCode] = true;
            });
        }
        setCheckedRows(newCheckedRows);
        setSelectAllChecked(!selectAllChecked);
    };

    const toggleCheckbox = (adCode) => {
        const newCheckedRows = { ...checkedRows };
        newCheckedRows[adCode] = !newCheckedRows[adCode];
        setCheckedRows(newCheckedRows);
        setSelectAllChecked(false);
    };
    
    // 삭제
    const deleteHandler = () => {
        const selectedAdCodes = Object.keys(checkedRows).filter((adCode) => checkedRows[adCode]);
        console.log("Selected adCodes:", selectedAdCodes);
        
        if(selectedAdCodes == null || selectedAdCodes.length < 1){
            alert("삭제할 항목을 선택해주세요.");
            return;
        }else{

            if (window.confirm("선택한 문서를 해당 보관함에서 삭제 하시겠습니까?")) {
                selectedAdCodes.forEach(adCode => {
                    dispatch(calldeleteDocInStorageAPI({adCode: adCode ,abCode: abCode}))
                        .then()
                        .catch((error) => { console.error("문서 삭제 실패: ", error); });
                });
            }            
            window.location.reload();
        }
    }

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">{abName}</h4>
            <div className="ly_spaceBetween">
                <button type="button" className="el_btnS el_btn8Back" onClick={deleteHandler}>삭제</button>
                <form onSubmit={handleSearch}>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                           placeholder="검색어를 입력해주세요"/>
                    <input type="submit" className="el_btnS el_btnblueBord hp_ml5" value="검색"/>
                </form>
            </div>
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
                        <th scope="col"><input type="checkbox" checked={selectAllChecked} onChange={toggleSelectAll}/>
                        </th>
                        <th scope="col">결재양식</th>
                        <th scope="col">제목</th>
                        <th scope="col">최종결재자</th>
                        <th scope="col">완료일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentResults && currentResults.length > 0 ? (
                        currentResults.map((document, index) =>
                            <tr key={document.adCode}
                                onClick={() => navigate(`/approval/view/${document.adCode}`, {state: {document}})}
                                className="hp_tr__click">
                                <td><input type="checkbox" checked={checkedRows[document.adCode]}
                                           onChange={() => toggleCheckbox(document.adCode)}
                                           onClick={(e) => e.stopPropagation()}/></td>
                                <td>{document.afName}</td>
                                <td className="hp_alignL">{document.adTitle}</td>
                                <td>{document.empName}</td>
                                <td>{document.talDate}</td>
                            </tr>
                        )
                    ) : (
                        <tr>
                            <td colSpan="5" className="hp_pt50 hp_pb50 hp_7Color">목록이 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </section>
            <div className="ly_spaceBetween ly_fitemC hp_mt10">
                <div className="hp_ml10 hp_7Color">총 <b
                    className="hp_0Color hp_fw700">{currentPage}</b> / {totalPages} 페이지
                </div>
                <select className="" onChange={handleSortChange} value={sortOption}>
                    <option value="">정렬방식</option>
                    <option value="완료일">완료일</option>
                    <option value="결재양식">결재양식</option>
                    <option value="제목">제목</option>
                </select>
            </div>
            <PagingBar pageInfo={{currentPage, maxPage: totalPages}} setCurrentPage={handlePageChange}/>
        </div>
    )
}

export default BoxMain;
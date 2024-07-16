import { useDispatch, useSelector } from "react-redux";
import PagingBar from "../../../components/commons/PagingBar";
import { useEffect, useState } from "react";
import {callregistDocInStorageAPI, callsendDocListAPI} from "../../../apis/ApprovalAPICalls";
import { useParams } from "react-router";
import Waiting from "./Waiting";
import Progress from "./Progress";
import Complete from "./Complete";
import Return from "./Return";
import {callMyInfoAPI} from "../../../apis/EmployeeAPICalls";

function DocumentMain(){
    const {status} = useParams();
    const [title, setTitle] = useState();
    const dispatch = useDispatch();
    const { employee, documents, boxes } = useSelector(state => ({
        employee: state.employeeReducer.employee,
        documents: state.approvalReducer.documents,
        boxes: state.approvalReducer.boxes,
    }));

    useEffect(() => {
        dispatch(callMyInfoAPI());
    }, [dispatch]);

    // console.log("employee", employee);

    // 접근 url에 따라 렌더링 변경
    useEffect(() => {
        switch (status) {
            case 'waiting': setTitle('대기'); break;
            case 'progress': setTitle('진행중'); break;
            case 'complete': setTitle('완료'); break;
            case 'return': setTitle('반려'); break;
            default: setTitle('');
        }
        setCurrentPage(1);
    }, [status]);

    // console.log("status", status);
    
    const renderDocList = () => {
        switch(status){
            case 'waiting': return <Waiting data={currentResults} />; break;
            case 'progress': return <Progress data={currentResults} />; break;
            case 'complete': return <Complete data={currentResults} setSelectedAdCodes={setSelectedAdCodes} />; break;
            case 'return': return <Return data={currentResults} />; break;
        }
    }

    // 정보 받아오기
    useEffect(() => {
        employee && dispatch(callsendDocListAPI({empCode: employee.emp_code, status}));
    }, [employee, status]);

    console.log("documents", documents);

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
        setCurrentPage(1);
    };

    // console.log("searchResults", searchResults);

    // 정렬방식 추가
    const [sortOption, setSortOption] = useState('');

    const sortDocuments = (results, option) => {
        switch (option) {
            case '상신일':
                return results.slice().sort((a, b) => new Date(a.adReportDate) - new Date(b.adReportDate));
            case '결재양식':
                return results.slice().sort((a, b) => a.afName.localeCompare(b.afName));
            case '제목':
                return results.slice().sort((a, b) => a.adTitle.localeCompare(b.adTitle));
            case '완료일':
                return results.slice().sort((a, b) => a.talDate.localeCompare(b.talDate));
            case '반려일':
                return results.slice().sort((a, b) => a.talDate.localeCompare(b.talDate));
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

    // 개인보관함으로 이동
    const [selectedAdCodes, setSelectedAdCodes] = useState([]);

    // console.log("boxes", boxes);
    // console.log("selectedAdCodes", selectedAdCodes);

    const [selectedAbCode, setSelectedAbCode] = useState("");
    const handleBoxChange = (event) => {
        setSelectedAbCode(event.target.value);
        console.log("Selected abCode:", event.target.value);

        if(!selectedAdCodes.length>0){
            alert("결재문서의 체크박스 선택 후, 이동할 보관함을 선택해주세요.");
            setSelectedAbCode("");
            return;
        }else{

            if (window.confirm("선택한 결재문서를 개인보관함에 저장 하시겠습니까?")) {
                selectedAdCodes.forEach((adCode) => {
                    dispatch(callregistDocInStorageAPI({adCode, abCode: event.target.value}))
                        .then(() => {
                            window.location.reload();
                        })
                        .catch((error) => {
                            console.error("결재문서 이동 실패: ", error);
                        });
                });
            }
        }
    };

    return(        
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">보낸결재함 [{title}]</h4>
            <div className="ly_spaceBetween">
                {status == "complete" ? (
                    <select onChange={handleBoxChange} value={selectedAbCode}>
                        <option value=''>개인보관함으로 이동</option>
                        {boxes && boxes.map((box, index) => (
                            <option key={box.abCode} value={box.abCode}>
                                {box.abName}
                            </option>
                        ))}
                    </select>
                ) : (<div></div>)}
                <form onSubmit={handleSearch}>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="검색어를 입력해주세요"/>
                    <input type="submit" className="el_btnS el_btnblueBord hp_ml5" value="검색"/>
                </form>
            </div>
            {renderDocList()}
            <div className="ly_spaceBetween ly_fitemC hp_mt10">
                <div className="hp_ml10 hp_7Color">총 <b
                    className="hp_0Color hp_fw700">{currentPage}</b> / {totalPages} 페이지
                </div>
                <select className="" onChange={handleSortChange} value={sortOption}>
                    <option value="">정렬방식</option>
                    {status == "waiting" || status == "progress" ? (
                        <option value="상신일">상신일</option>
                    ):""}
                    <option value="결재양식">결재양식</option>
                    <option value="제목">제목</option>
                    {status == "complete" ? (
                        <option value="완료일">완료일</option>
                    ):""}
                    {status == "return" ? (
                        <option value="반려일">반려일</option>
                    ):""}
                </select>
            </div>
            <PagingBar pageInfo={{currentPage, maxPage: totalPages}} setCurrentPage={handlePageChange} />
        </div>
    )
}
export default DocumentMain;
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callGETPostList } from "../postApi/PostAPI";
import '../../css/poststyle.css';



// script.js

function renderRows() {
    const allPosts = useSelector(state => state.postReducer.Postdata);

return allPosts.map(item => (
    <tr key={item.PostCode}>
        <td>{item.PostCode}</td>
        <td>{item.LowBoardCode}</td>
        <td>{item.PostName}</td>
        <td>{item.EmpCode}</td>
        <td>{item.PostDate}</td>
        <td>{item.PostViewCnt}</td>
    </tr>
));
}



function Postlist() {


const dispatch=useDispatch();
useEffect(()=>{
    dispatch(callGETPostList());
}, [dispatch])

console.log("Current posts state:", allPosts); // 상태 출력


    return (
        <>
        <h1>전체 게시판</h1>
        <br /><br /><br />
        <div class="searchZone">
            <input />
            <button>검색</button>
        </div>
        <span class="main">
            <table>
                <thead>
                    <tr class="tableHead">
                        <th>No</th>
                        <th>분류</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>열람</th>
                    </tr>
                    {renderRows()}
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>
            <div class="button">
                <button> 이전 </button>
                <h4>1</h4>
                <button> 다음 </button>
            </div>
        </span>
        </>
    );
}
export default Postlist;




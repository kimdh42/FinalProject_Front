import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callGETPostList, callGETpostSearch } from './postApi/PostAPI';
import { Link } from 'react-router-dom';

function PostListView() {
  const dispatch = useDispatch();
  const postState = useSelector(state => state.post);
  const { Postdata, PostSearch } = postState;

  const [postsearch, setpostSearch] = useState('');
  const [displayData, setDisplayData] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // 페이지당 데이터 개수

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    dispatch(callGETPostList(currentPage, pageSize)); // 첫 번째 페이지, 페이지당 10개의 데이터 요청
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    setDisplayData(Postdata);
  }, [Postdata]);

  useEffect(() => {
    if (postsearch) {
      setDisplayData(PostSearch);
    } else {
      setDisplayData(Postdata);
    }
  }, [PostSearch, postsearch, Postdata]);

  const renderRows = () => {
    if (!Array.isArray(displayData) || displayData.length === 0) {
      return <tr><td colSpan="6">로딩 중...</td></tr>;
    }

    return displayData.map(item => {
      const lowBoardCode = item.lowBoardCode ? item.lowBoardCode.lowBoardCode : 'N/A';
      const lowBoardName = item.lowBoardCode ? item.lowBoardCode.lowBoardName : 'N/A';

      return (
        <tr key={item.postCode}>
          <td>{item.postCode}</td>
          <td>
            <Link to={`/post/PostDetail/${item.postCode}`}>
              {item.postName}
            </Link>
          </td>
          <td>{item.empName}</td>
          <td>{item.postDate}</td>
          <td>{item.postViewCnt}</td>
        </tr>
      );
    });
  };

  const onChangeHandler = (e) => {
    setpostSearch(e.target.value);
  };

  const onSearchHandler = () => {
    const search = postsearch;
    const encodingsearch = encodeURIComponent(search);
    dispatch(callGETpostSearch(encodingsearch));
  };

  return (
    <>      
      <div className="main" style={{ width: "900px" }}>
        <h1 style={{ fontSize: '50px' }}>전체 게시판</h1>
        <br /><br /><br />
        <div className="searchZone">
          <input
            type="text"
            value={postsearch}
            onChange={onChangeHandler}
          />
          <button
            type="button"
            className="button"
            onClick={onSearchHandler}
          >
            검색
          </button>
        </div>
        <table className="bl_tb1">
          <thead>
            <tr className="tableHead">
              <th>No</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>열람</th>
            </tr>
          </thead>
          <tbody className='tableBody'>
            {renderRows()}
          </tbody>
        </table>
        <div className="bl_paging" style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={prevPage} disabled={currentPage === 0} className="bl_paging__btn bl_paging__prev">  </button>
          <span>{currentPage + 1}</span>
          <button onClick={nextPage} className="bl_paging__btn">  </button>
        </div>
      </div>
    </>
  );
}

export default PostListView;

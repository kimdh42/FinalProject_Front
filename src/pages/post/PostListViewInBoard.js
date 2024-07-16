import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callGETInboardList, callGETInboardPinList, callGETLowBoardList } from './postApi/PostAPI';
import { callGETLowBoardListToCode,callGETPostList, callGETpostSearch } from './postApi/PostAPI';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function PostListViewInBoard() {
  const dispatch = useDispatch();
  const postState = useSelector(state => state.post);
  const [displayData, setDisplayData] = useState([]);

  const PostdataInBoardState = useSelector(state => state.post.PostdataInBoard); // Redux store에서 PostdataInBoard 상태 가져오기
  const PostdataInBoardPinState = useSelector(state => state.post.PostdataInBoardPin); // Redux store에서 PostdataInBoardPin 상태 가져오기
  const LowCodeList = useSelector(state => state.post.LowCodeList); // Redux store에서 PostdataInBoardPin 상태 가져오기

  const [postsearch, setpostSearch] = useState('');
  const { Postdata, PostSearch } = postState;

  const { lowBoardCode } = useParams(); // URL의 파라미터로부터 lowBoardCode 가져오기

  const onSearchHandler = () => {
    const search = postsearch;
    const encodingsearch = encodeURIComponent(search);
    dispatch(callGETpostSearch(encodingsearch));
  };

  const onChangeHandler = (e) => {
    setpostSearch(e.target.value);
  };

  useEffect(() => {
    if (postsearch) {
      // 검색 결과가 있을 경우 PostSearch를 사용하여 displayData를 설정
      setDisplayData(PostSearch);
    } else {
      // 검색 결과가 없을 경우 PostdataInBoardState를 사용하여 displayData를 설정
      setDisplayData(PostdataInBoardState);
    }
  }, [PostSearch, postsearch, PostdataInBoardState]);

  useEffect(() => {
    // lowBoardCode가 변경될 때마다 게시글 목록과 고정글 목록을 불러옴
    dispatch(callGETInboardList(lowBoardCode));
    dispatch(callGETInboardPinList(lowBoardCode));
    dispatch(callGETLowBoardListToCode(lowBoardCode))
  }, [dispatch, lowBoardCode]);

  const pinBoard = () => {
    if (!Array.isArray(PostdataInBoardPinState) || PostdataInBoardPinState.length === 0) {
      return <tr><td colSpan="5">고정글이 없습니다</td></tr>;
    }

    return PostdataInBoardPinState.map(item => (
      <tr key={item.postCode}>
        <td>{item.postCode}</td>
        <td>{item.postName}</td>
        <td>{item.empCode}</td>
        <td>{item.postDate}</td>
        <td>{item.postViewCnt}</td>
      </tr>
    ));
  };

  const board = () => {
    if (!Array.isArray(displayData) || displayData.length === 0) {
      console.log("displayData",displayData);
      return <tr><td colSpan="5">글이 없습니다</td></tr>;
    }

    return displayData.map(item => (
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
    ));
  };

  return (
    <>
      <div className="main" style={{width: "900px"}}>
        <h1 style={{ fontSize: '50px' }}>{LowCodeList.lowBoardName}</h1>
        <br /><br /><br />
        <div className="searchZone">
          <input type="text"
            value={postsearch}
            onChange={onChangeHandler}
          />
          <button type='button' className='button button' onClick={onSearchHandler}>
            검색
          </button>
        </div>
        <table className='bl_tb1'>
          <thead>
            <tr className="tableHead">
              <th>No</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>열람</th>
            </tr>
          </thead>
          <tbody>
            {/* {pinBoard()} */}
            {board()}
          </tbody>
        </table>
        <div className="bl_paging" style={{ display: 'flex', right: "100px" }}>
          <button className='bl_paging__btn bl_paging__prev'>  </button>
          <h4>1</h4>
          <button className='bl_paging__btn '>  </button>
        </div>
      </div>
    </>
  );
}

export default PostListViewInBoard;

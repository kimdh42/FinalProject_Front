import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callGETReadyPost } from './postApi/PostAPI'; // PostAPI 경로는 프로젝트에 맞게 수정 필요
import { callDepartmentEmployeesAPI } from '../../apis/EmployeeAPICalls'; // EmployeeAPICalls 경로는 프로젝트에 맞게 수정 필요
import { callMyInfoAPI } from '../../apis/EmployeeAPICalls'; // EmployeeAPICalls 경로는 프로젝트에 맞게 수정 필요
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function PostReadyList() {
  const dispatch = useDispatch();
  const PostReadyState = useSelector(state => state.post.PostReadyState);
  console.log(PostReadyState)
  const { Postdata, PostSearch } = PostReadyState;
  const { empcode } = useParams();
  const [postsearch, setPostSearch] = useState('');
  const [displayData, setDisplayData] = useState([]);
  const [empCode, setEmpCode] = useState('');
  
  // useEffect(() => {
  //   dispatch(callDepartmentEmployeesAPI());
  //   dispatch(callMyInfoAPI());
  // }, [dispatch]);

  // const employees = useSelector(state => state.employeeReducer.employees?.employees || []);

  useEffect(() => {
      dispatch(callGETReadyPost(empcode));
      console.log(empcode)
    
  }, [dispatch]);

  useEffect(() => {
    setDisplayData(postsearch ? PostSearch : Postdata);
  }, [postsearch, Postdata, PostSearch]);

  const renderRows = () => {
    if (!Array.isArray(PostReadyState) || PostReadyState.length === 0) {
      return <tr><td colSpan="6">로딩 중...</td></tr>;
    }

    return PostReadyState.map(item => {
      const lowBoardCode = item.lowBoardCode ? item.lowBoardCode.lowBoardCode : 'N/A';
      const lowBoardName = item.lowBoardCode ? item.lowBoardCode.lowBoardName : 'N/A';

      return (
        <tr key={item.postCode}>
          <td>{item.postCode}</td>
          <Link to={`/post/PostEditView/${item.postCode}`}>
            {item.postName}
          </Link>
          <td>{item.empCode}</td>
          <td>{item.postDate}</td>
          <td>{item.postViewCnt}</td>
        </tr>
      );
    });
  };

  return (
    <div className="main" style={{width: "900px"}}>
      <h1 style={{ fontSize: '50px' }}>임시 저장</h1>
      <br /><br /><br />
      <table className="bl_tb1" style={{backgroundColor:"whitesmoke",boxSizing: "border-box"}}>
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
          {renderRows()}
        </tbody>
      </table>
    </div>
  );
}

export default PostReadyList;

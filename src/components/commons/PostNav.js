import { getAllLowBoard } from '../../pages/post/postApi/PostAPI';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { callMyInfoAPI } from '../../apis/EmployeeAPICalls';

function PostNav() {
    const dispatch = useDispatch();
    const AllLowState = useSelector(state => state.post.AllLowState);
    const [boards, setBoards] = useState({});
    const employees = useSelector(state => state.employeeReducer.employee);

    useEffect(() => {
        dispatch(getAllLowBoard());
        dispatch(callMyInfoAPI());
    }, [dispatch]);

    useEffect(() => {
        if (AllLowState.length > 0) {
            const groupedBoards = AllLowState.reduce((acc, lowBoard) => {
                const boardName = lowBoard.boardCode.boardName;

                if (!acc[boardName]) {
                    acc[boardName] = {
                        boardCode: lowBoard.boardCode.boardCode,
                        boardName: lowBoard.boardCode.boardName,
                        lowBoards: []
                    };
                }

                acc[boardName].lowBoards.push(lowBoard);
                return acc;
            }, {});
            
            // Filter out the board with boardCode '5'
            Object.keys(groupedBoards).forEach(boardName => {
                groupedBoards[boardName].lowBoards = groupedBoards[boardName].lowBoards.filter(
                    lowBoard => lowBoard.boardCode.boardCode !== 5
                );
            });

            setBoards(groupedBoards);
        }
    }, [AllLowState]);

    return (
        <div className="bl_nav">
            <h1 className="bl_nav__ttl">게시판</h1>
            <ul>
                <li className='bl_nav__ttlSub'>
                    <Link to={`/post/PostCreateView`}>
                        게시글 작성
                    </Link>
                </li>

                <li className='bl_nav__ttlSub'>
                    <Link to={`/post/PostListView`}>
                        전체 게시판
                    </Link>
                </li>

                <li className='bl_nav__ttlSub'>
                    <Link to={`/post/PostReadyList/${employees.emp_code}`}>
                        임시 저장
                    </Link>
                </li>

                {Object.keys(boards).map(boardName => {
                    // Filter out boards with all lowBoards having boardCode 0
                    if (boards[boardName].lowBoards.every(lowBoard => lowBoard.boardCode === 0)) {
                        return null;
                    }

                    return (
                        <React.Fragment key={boardName}>
                            <li className="parent-board">
                                <span className='bl_nav__ttlSub'>
                                    {boardName} 
                                </span>
                                <ul className="bl_nav__menuSub">
                                    {boards[boardName].lowBoards.map((lowBoard, index) => (
                                        lowBoard.boardCode !== 0 && ( // Exclude low boards with boardCode 0
                                            <li key={lowBoard.lowBoardCode} className="button-wrapper">
                                                {lowBoard.lowBoardName !== 'Deleted' && (
                                                    <Link to={`/post/PostListViewInBoard/${lowBoard.lowBoardCode}`}>
                                                        {lowBoard.lowBoardName}
                                                    </Link>
                                                )}
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </li>
                        </React.Fragment>
                    );
                })}

                <li className='bl_nav__ttlSub'>
                    <Link to={`/post/BoradCreateView`}>
                        게시판 관리
                    </Link>
                </li>
            </ul>
        </div>
    )
}

export default PostNav;

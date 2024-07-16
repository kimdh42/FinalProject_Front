import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { callGETDetail, callGETFile, callGETComment } from './postApi/PostAPI';
import { callMyInfoAPI } from '../../apis/EmployeeAPICalls';

function PostDetailView() {
    const dispatch = useDispatch();
    const { postCode } = useParams();
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [editingComment, setEditingComment] = useState(null);

    const employee = useSelector(state => state.employeeReducer.employee);

    useEffect(() => {
        dispatch(callMyInfoAPI());
    }, []);

    useEffect(() => {
        dispatch(callGETDetail(postCode));
        dispatch(callGETFile(postCode));
        dispatch(callGETComment(postCode));
    }, [dispatch, postCode]);

    const DetailData = useSelector(state => state.post.DetailState);
    const FileData = useSelector(state => state.post.FileState);
    const CommentState = useSelector(state => state.post.CommentState);

    const generateHtmlContent = () => {
        let htmlContent = '';

        if (FileData && FileData.length > 0) {
            htmlContent = FileData.map((file, index) => {
                if (file.attachOriginal.toLowerCase().endsWith('.jpg') || file.attachOriginal.toLowerCase().endsWith('.png')) {
                    return `<img src="http://localhost:8080/post/downloadFile/${file.attachSave}" alt="${file.attachOriginal}" style="max-width: 100%; max-height: 500px;" />`;
                } else {
                    return null;
                }
            }).join('<br/>');
        }

        if (DetailData.postCon) {
            htmlContent += `<br/>${DetailData.postCon}`;
        }

        return htmlContent;
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
    
        let commStatus = 'N';
        if (DetailData.postCommSet === 'ALLOW_ANONYMOUS') {
            commStatus = 'Y';
        } else if (DetailData.postCommSet === 'ALLOW_BOTH' && isAnonymous) {
            commStatus = 'Y';
        }
    
        const commentData = {
            commCon: newComment,
            commStatus: commStatus,
            postCode: DetailData.postCode,
            commDate: new Date().toISOString()
        };
    
        try {
            const token = localStorage.getItem('access-token');
            const response = await axios.post('http://localhost:8080/post/commentAdd', commentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };
    
    const handleEditClick = (commentId) => {
        const commentToEdit = CommentState.find(comment => comment.comm_code === commentId);
        if (commentToEdit) {
            setEditingComment(commentToEdit);
            setNewComment(commentToEdit.comm_con);
        }
    };

    const handleEditSave = async () => {
        if (!editingComment) return;
    
        let commStatus = 'N';
        if (DetailData.postCommSet === 'ALLOW_ANONYMOUS') {
            commStatus = 'Y';
        } else if (DetailData.postCommSet === 'ALLOW_BOTH' && isAnonymous) {
            commStatus = 'Y';
        }
    
        const editedCommentData = {
            commCon: newComment,
            commStatus: commStatus,
            postCode: DetailData.postCode,
            commDate: new Date().toISOString()
        };
    
        try {
            const token = localStorage.getItem('access-token');
            const response = await axios.put(`http://localhost:8080/post/commentEdit/${editingComment.comm_code}`, editedCommentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            const updatedComments = CommentState.map(comment =>
                comment.comm_code === editingComment.comm_code ? response.data : comment
            );
    
            setComments(updatedComments);
            setEditingComment(null);
            setNewComment('');
        } catch (error) {
            console.error('Failed to edit comment:', error);
        }
    };
    
    const handleDeleteClick = async (commCode) => {
        try {
            const token = localStorage.getItem('access-token');
            await axios.put(`http://localhost:8080/post/commentDelete/${commCode}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const updatedComments = CommentState.filter(comment => comment.comm_code !== commCode);
            setComments(updatedComments);
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const renderDetail = () => {
        if (!DetailData) return null;

        return (
            <div className="main" style={{ width: "900px", height: "auto", marginLeft: "10px", marginBottom: "20px", padding: "20px", boxShadow: "1px 1px 10px black", backgroundColor: "white", borderRadius: "8px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th colSpan="4" style={{ textAlign: "left", fontSize: "24px", padding: "10px 0", borderBottom: "2px solid #ccc" }}>
                                게시판
                                {employee.emp_code === DetailData.empCode && (
                                    <Link to={`/post/PostEditView/${DetailData.postCode}`} style={{ float: "right", textDecoration: "none", color: "#007bff" }}>수정</Link>

                                )}
                            </th>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ccc" }}>
                            <td style={{ backgroundColor: "lightgray", border: "1px solid grey", padding: "10px" }}>게시글 번호</td>
                            <td style={{ padding: "10px" }}>{DetailData.postCode}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ccc" }}>
                            <td style={{ backgroundColor: "lightgray", border: "1px solid grey", padding: "10px" }}>작성자</td>
                            <td style={{ padding: "10px" }}>{DetailData.empCode}</td>
                            <td style={{ backgroundColor: "lightgray", border: "1px solid grey", padding: "10px" }}>작성일</td>
                            <td style={{ padding: "10px" }}>{DetailData.postDate}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ccc" }}>
                            <td style={{ backgroundColor: "lightgray", border: "1px solid grey", padding: "10px" }}>첨부파일</td>
                            <td colSpan="3" style={{ padding: "10px" }}>
                                {FileData && FileData.length > 0 ? (
                                    FileData.map((file, index) => (
                                        <a
                                            key={index}
                                            href={`http://localhost:8080/post/downloadFile/${file.attachSave}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: "block", color: "#007bff", textDecoration: "none", margin: "5px 0" }}
                                        >
                                            {file.attachOriginal}
                                        </a>
                                    ))
                                ) : (
                                    <span>첨부 파일이 없습니다.</span>
                                )}
                            </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ccc" }}>
                            <td style={{ backgroundColor: "lightgray", border: "1px solid grey", padding: "10px" }}>제목</td>
                            <td colSpan="3" style={{ padding: "10px" }}>{DetailData.postName}</td>
                        </tr>
                        <tr>
                            <td style={{ backgroundColor: "lightgray", border: "1px solid grey", padding: "10px" }}>내용</td>
                            <td colSpan="3" style={{ padding: "10px" }}>
                                <div dangerouslySetInnerHTML={{ __html: generateHtmlContent() }} style={{ border: "1px solid grey", padding: "10px", borderRadius: "4px" }} />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="4" style={{ padding: "20px" }}>
                                {DetailData.postCommSet === 'ALLOW_NORMAL' && renderCommentSection('댓글 작성')}
                                {DetailData.postCommSet === 'ALLOW_ANONYMOUS' && renderCommentSection('익명 댓글 작성')}
                                {DetailData.postCommSet === 'ALLOW_BOTH' && renderCommentSection('댓글 작성', true)}
                                {DetailData.postCommSet === 'ALLOW_NONE' && <p>댓글이 비허용되었습니다.</p>}
                            </td>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    };

const renderCommentSection = (buttonText, allowAnonymous = false) => (
    <div style={{ marginTop: "20px" }}>
        <form onSubmit={editingComment ? handleEditSave : handleCommentSubmit} style={{ display: "flex", flexDirection: "column", marginBottom: "20px" }}>
            <textarea
                value={newComment}
                onChange={handleCommentChange}
                style={{
                    width: "100%",
                    height: "100px",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    resize: "none"
                }}
                placeholder="댓글을 입력하세요."
            />
            {allowAnonymous && (
                <label style={{ marginBottom: "10px", fontSize: "14px" }}>
                    <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={() => setIsAnonymous(!isAnonymous)}
                        style={{ marginRight: "5px" }}
                    />
                    익명으로 작성
                </label>
            )}
            <button
                type="submit"
                style={{
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    backgroundColor: "#007bff",
                    color: "white",
                    cursor: "pointer",
                    alignSelf: "flex-end",
                    transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
            >
                {buttonText}
            </button>
        </form>
        <ul style={{ listStyle: "none", padding: "0" }}>
            {CommentState.map((comment) => (
                <li key={comment.comm_code} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    {comment.comm_status !== 'Y' && (
                        <div>
                            {comment.emp_name} || {comment.commDate}
                        </div>
                    )}
                    <h1></h1>
                    {comment.comm_con}
                    {employee.emp_code === comment.emp_code && (
                        <div style={{ marginTop: "10px" }}>
                            <button
                                onClick={() => handleEditClick(comment.comm_code)}
                                style={{
                                    marginRight: "10px",
                                    padding: "5px 10px",
                                    border: "none",
                                    backgroundColor: "#ffc107",
                                    color: "white",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s"
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#e0a800"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "#ffc107"}
                            >
                                수정
                            </button>
                            <button
                                onClick={() => handleDeleteClick(comment.comm_code)}
                                style={{
                                    padding: "5px 10px",
                                    border: "none",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s"
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = "#c82333"}
                                onMouseOut={(e) => e.target.style.backgroundColor = "#dc3545"}
                            >
                                삭제
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

    return <div>{renderDetail()}</div>;
}

export default PostDetailView;

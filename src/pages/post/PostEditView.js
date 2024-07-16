import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { callGETBoardList, callGETLowBoardList,callGETSoftList,callGETDetail } from './postApi/PostAPI';
import { callMyInfoAPI } from '../../apis/EmployeeAPICalls';

function PostEditView() {
    const [formData, setFormData] = useState({
        postName: '',
        postCon: '',
        attachFile: '',
        postCommSet: 3,  // 기본값: 둘다 비활성화
        lowBoardCode: '',
        psCode:''
    });
    const dispatch = useDispatch();
    const BoardState = useSelector(state => state.post.BoardState);
    const LowBoardState = useSelector(state => state.post.LowBoardState);
    const SoftListState=useSelector(state => state.post.SortListState);
    const { postCode } = useParams(); // URL의 파라미터로부터 postCode 가져오기
    const DetailData = useSelector(state => state.post.DetailState);
    useEffect(() => {
        dispatch(callMyInfoAPI());
    }, []);
    const employees = useSelector(state => state.employeeReducer.employee);
    const navigate = useNavigate();


    useEffect(()=>{
        dispatch(callGETDetail(postCode));
    },[dispatch])
    useEffect(() => {
        dispatch(callGETBoardList());
    }, [dispatch]);
    useEffect(() => {   
        dispatch(callGETSoftList());
    }, [dispatch]);

    const handleInputChange = (event) => {
        const {name,value, files } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? Array.from(files) : value
        }));
    };
    const handleInputChangename = (event) => {
        const {value} = event.target;
        setFormData(prevState => ({
            ...prevState,
            postName:value
        }));
    };
    console.log("SoftListState",SoftListState);
    console.log(DetailData)

    const onChangeHandler = (event) => {
        const boardCode = event.target.value;
        if (boardCode !== '선택하세요') {
            console.log(boardCode);
            dispatch(callGETLowBoardList(boardCode));
        }
    };

    const calculatePostCommSetValue = (allowNormal, allowAnonymous) => {
        if (allowNormal && allowAnonymous) return 3;
        if (allowNormal) return 1;
        if (allowAnonymous) return 2;
        return 4;
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setFormData(prevState => {
            const newPostCommSet = calculatePostCommSetValue(
                value === "ALLOW_NORMAL" ? checked : prevState.postCommSet === 0 || prevState.postCommSet === 2,
                value === "ALLOW_ANONYMOUS" ? checked : prevState.postCommSet === 1 || prevState.postCommSet === 2
            );
            console.log("comment:",newPostCommSet);
            return { ...prevState, postCommSet: newPostCommSet };
        });
    };
    const onChangeHandlerLow = (event) => {
        const { value } = event.target;
        console.log(value);
        setFormData(prevState => ({
            ...prevState,
            lowBoardCode: value  // lowBoardCode 업데이트
        }));
    };
    const onChangeHandlersoft = (event) => {
        const { value } = event.target;
        console.log(value);
        setFormData(prevState => ({
            ...prevState,
            psCode: value 
        }));
    };
    const getCurrentDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1 해줘야 함
        const day = currentDate.getDate();

        return `${year}.${month}.${day}`;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const { postName, postCon, attachFile, postCommSet,lowBoardCode,psCode } = formData;
    
        const formDataToSend = new FormData();
        formDataToSend.append('postName', postName);
        formDataToSend.append('postCon', postCon);
        formDataToSend.append('attachFile', attachFile);
        formDataToSend.append('postCommSet', postCommSet);
        formDataToSend.append('lowBoardCode', lowBoardCode);
        formDataToSend.append("psCode",psCode);
        
        if (attachFile) {
            for (let i = 0; i < attachFile.length; i++) {
                formDataToSend.append('attachFile', attachFile[i]);
            }
        }


        try {
            const response = await fetch(`http://localhost:8080/post/postUpdate/${postCode}`, {
                method: 'PUT',
                body: formDataToSend,
                mode: "cors"
            });
            console.log("PUT",formData)
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8080/post/postDelete/${postCode}`, {
                method: 'PUT',
                mode: 'cors'
            });
            if (response.ok) {
                navigate('/post/PostListView'); // 삭제 후 목록 페이지로 이동
            } else {
                console.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <div className="main" style={{width: "900px",height:"500px",marginLeft:"10px"}}>
            <form onSubmit={handleSubmit}>
                <table style={{boxShadow:"1px 1px 10px black"}}>
                    <thead className='tableHead' >
                        <tr>
                            <th colSpan="4">게시판</th>
                        </tr>
                        <tr style={{ border: "1px solid grey"}}>
                            <td>대분류</td>
                            <td >
                                <select onChange={onChangeHandler}>
                                    <option >선택하세요</option>
                                    {Array.isArray(BoardState) && BoardState.length > 0 ? (
                                        BoardState.map(item => (
                                            <option key={item.boardCode} value={item.boardCode}>
                                                {item.boardName}
                                            </option>
                                        ))
                                    ) : (
                                        <option>데이터 로딩 중...</option>
                                    )}
                                </select>
                            </td>
                            <td>소분류</td>
                            <td >
                            <select onChange={onChangeHandlerLow}>
                                    <option>선택하세요</option>
                                    {Array.isArray(LowBoardState) && LowBoardState.length > 0 ? (
                                        LowBoardState.filter(item => item.lowBoardName !== "Deleted").map(item => (
                                            <option key={item.lowBoardCode} value={item.lowBoardCode}>
                                                {item.lowBoardName}
                                            </option>
                                        ))
                                    ) : (
                                        <option>대분류를 선택해주세요</option>
                                    )}
                                </select>
                            </td>
                            <td>분류</td>
                            <td>
                                <select onChange={onChangeHandlersoft}>
                                    <option>선택하세요</option>
                                    {Array.isArray(SoftListState) && SoftListState.length > 0 ? (
                                        SoftListState.map(item => (
                                            <option key={item.psCode} value={item.psCode}>
                                                {item.psName}
                                            </option>
                                        ))
                                    ) : (
                                        <option>데이터 로딩 중...</option>
                                    )}                                
                                    </select>
                            </td>
                        </tr>
                        <tr style={{ border: "1px solid grey" }}>
                        <td >작성자</td>
                            <td>{employees.emp_name}</td>
                            <td >작성일</td>
                            <td>{getCurrentDate()}</td>
                        </tr>
                        <tr>
                            {/* <td>알림</td>
                            <td colSpan="3">
                                <label><input type="checkbox" value="sendCall" />알림 발송</label>
                                <label><input type="checkbox" value="sendMsg" />쪽지 발송</label>
                            </td> */}
                        </tr>
                        <tr style={{ border: "1px solid grey" }}>
                            <td>첨부파일</td>
                            <td colSpan="3"><input name="attachFile" type="file" multiple  onChange={handleInputChange} /></td>
                        </tr>
                        <tr style={{ border: "1px solid grey" }}>
                            <td >제목</td>
                            <td colSpan="3"><input name="postName" type="text" placeholder="100자 이내 입력" data={DetailData.postName} onChange={handleInputChangename} /></td>
                        </tr>
                        <tr style={{ border: "1px solid grey" }}>
                            <td>내용</td>
                            <td colSpan="3">
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={DetailData.postCon || ''}  // DetailData.postCon이 유효하지 않을 경우 빈 문자열을 기본값으로 설정
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setFormData(prevState => ({
                                            ...prevState,
                                            postCon: data
                                        }));
                                    }}
                                />
                            </td>
                        </tr>
                        <tr style={{ border: "1px solid grey" }}>
                            <td>설정</td>
                            <td colSpan="3">
                                <label><input type="checkbox" value="ALLOW_NORMAL" name="postCommSet" onChange={handleCheckboxChange} />댓글 허용</label>
                                <label><input type="checkbox" value="ALLOW_ANONYMOUS" name="postCommSet" onChange={handleCheckboxChange} />익명 댓글 허용</label>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="4" className='el_btnS'>
                                <button className='el_btnredBack' type="button">취소</button>
                                <button className='el_btn8Back' type="button">임시저장</button>
                                <button className='el_btn0Bord' type="submit">저장</button>
                                <button className='el_btnredBack' type="button" onClick={handleDelete}>삭제</button>
                            </td>
                        </tr>
                    </thead>
                </table>
            </form>
        </div>
    );
}

export default PostEditView;

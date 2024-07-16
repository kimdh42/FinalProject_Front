// src/App.js
import React, { useState, useEffect } from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';


function PostCreate() {
    const [formData, setFormData] = useState({
        postName: '',
        postCon: '',
        attachFile: null
    });

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'attachFile') {
            setFormData(prevState => ({
                ...prevState,
                attachFile: files[0]
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { postName, postCon, attachFile } = formData;
        const formDataToSend = new FormData();
        formDataToSend.append('postName', postName);
        formDataToSend.append('postCon', postCon);
        formDataToSend.append('attachFile', attachFile);

        try {
            const response = await fetch('http://localhost:8080/post/add', {
                method: 'POST',
                body: formDataToSend,
                mode: "cors"
            });
            console.log("PostTest")
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="main">
            <form onSubmit={handleSubmit}>
                <table>
                    <thead>
                        <tr>
                            <th colSpan="4">게시판</th>
                        </tr>
                        <tr>
                            <td>대분류</td>
                            <td >
                                <select>
                                    <option value="">선택하세요</option>
                                    <option value="1">암환자회복식단</option>
                                    <option value="2">신장관리식단</option>
                                    <option value="3">혈압관리식단</option>
                                    <option value="4">혈당관리식단</option>
                                </select>
                            </td>
                            <td>소분류</td>
                            <td>
                                <select>
                                    <option value="">선택하세요</option>
                                    <option value="1">암환자회복식단</option>
                                    <option value="2">신장관리식단</option>
                                    <option value="3">혈압관리식단</option>
                                    <option value="4">혈당관리식단</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>작성자</td>
                            <td>김씨</td>
                            <td>작성일</td>
                            <td>2024.10.01</td>
                        </tr>
                        <tr>
                            <td>알림</td>
                            <td colSpan="3">
                                <label><input type="checkbox" value="sendCall" />알림 발송</label>
                                <label><input type="checkbox" value="sendMsg" />쪽지 발송</label>
                            </td>
                        </tr>
                        <tr>
                            <td>첨부파일</td>
                            <td colSpan="3"><input name="attachFile" type="file" onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td>제목</td>
                            <td colSpan="3"><input name="postName" type="text" placeholder="100자 이내 입력" value={formData.postName} onChange={handleInputChange} /></td>
                        </tr>
                        <tr>
                            <td>내용</td>
                            <td colSpan="3">
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={formData.postCon}
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
                        <tr>
                            <td>설정</td>
                            <td colSpan="3">
                                <label><input type="checkbox" value="ALLOW_NORMAL" name="postCommSet" />댓글 허용</label>
                                <label><input type="checkbox" value="ALLOW_ANONYMOUS" name="postCommSet" />익명 댓글 허용</label>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="4">
                                <button type="button">취소</button>
                                <button type="button">임시저장</button>
                                <button type="submit">저장</button>
                            </td>
                        </tr>
                    </thead>
                </table>
            </form>
        </div>
    );
}

export default PostCreate;

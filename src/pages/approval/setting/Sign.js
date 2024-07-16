import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { callMyInfoAPI } from "../../../apis/EmployeeAPICalls";
import {fetchImage, uploadImage} from "../../../apis/ApprovalAPICalls";

function Sign() {
    const dispatch = useDispatch();
    const { employee } = useSelector(state => ({
        employee: state.employeeReducer.employee
    }));

    useEffect(() => {
        dispatch(callMyInfoAPI());
    }, [dispatch]);

    console.log("employee", employee);

    // 서명 이미지 조회
    const [imageData, setImageData] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (employee.emp_sign) {
                try {
                    const imageUrl = await fetchImage(employee.emp_sign);
                    if (imageUrl) {
                        setImageData(imageUrl);
                    } else {
                        console.error('이미지 가져오기 실패');
                    }
                } catch (error) {
                    console.error('이미지 가져오는 중 오류 발생:', error);
                }
            }
        };

        fetchData();
    }, [employee.emp_sign]);

    // 파일 첨부
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageData(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    // 파일 저장
    const handleFileUpload = async () => {
        if (file) {
            console.log('파일 업로드:', file);

            const formData = new FormData();
            formData.append('image', file); // 여기서 필드 이름을 'image'로 설정

            try {
                const imageUrl = await uploadImage(employee.emp_code, formData);
                setImageData(imageUrl);
                console.log('이미지 업로드 성공:', imageUrl);
                setFile(null); // 파일 상태 초기화

                // 페이지 새로고침
                window.location.reload();
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
            }
        }
    };

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">서명관리</h4>
            <section className="bl_sect hp_mt10">
                <table className="bl_tb2">
                    <colgroup>
                        <col style={{ width: '200px' }} />
                        <col style={{ width: '*' }} />
                    </colgroup>
                    <tbody>
                    <tr>
                        <th scope="row">소속</th>
                        <td>{employee.dept_title}</td>
                    </tr>
                    <tr>
                        <th scope="row">직위</th>
                        <td>{employee.title_name}</td>
                    </tr>
                    <tr>
                        <th scope="row">이름</th>
                        <td>{employee.emp_name}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            서명<br/>
                            <label className="bl_attachBtn__label el_btnS el_btn8Back hp_p3-5">
                                <input type="file" accept="image/*" className="bl_attachBtn__input" onChange={handleFileChange}/> 파일선택
                            </label>
                        </th>
                        <td>
                            {imageData ? (
                                <img src={imageData} alt={`${employee.emp_name} 서명`}/>
                            ) : (
                                <p>서명 이미지가 없습니다.</p>
                            )}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </section>
            <button type="button" className="el_btnM el_btnblueBack hp_marginAuto hp_mt50" onClick={handleFileUpload}>저장
            </button>
        </div>
    );
}

export default Sign;

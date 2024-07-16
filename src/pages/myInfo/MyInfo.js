// import '../../css/personal.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { callGetProfileImgAPI, callMyInfoAPI, callUpdateMyInfoAPI, callUploadProfileImgAPI } from '../../apis/EmployeeAPICalls';
import DaumPostcode from 'react-daum-postcode';

// npm install react-daum-postcode

function MyInfo() {

    const dispatch = useDispatch();

    const employee = useSelector(state => state.employeeReducer.employee);
    const updateEmployee = useSelector(state => state.employeeReducer.updateEmployee);
    const profileImg = useSelector(state => state.employeeReducer.profileImg);

    console.log('Profile Image URL:', profileImg);

    useEffect(() => {
        dispatch(callMyInfoAPI());
    }, [dispatch]);

    useEffect(() => {
        if(employee) {
            dispatch(callGetProfileImgAPI(employee.emp_code));
        }
    }, [dispatch, employee]);

    const initialFormData = {
        email: '',
        phone: '',
        address: '',
        bank_name: '',
        account_num: '',
        new_emp_pass: '',
        emp_img: null,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [saveStatus, setSaveStatus] = useState(null);
    const [postcodeOpen, setPostcodeOpen] = useState(false);
    const [postcode, setPostcode] = useState('');
    const [mainAddr, setMainAddress] = useState('');
    const [detailAddr, setDetailAddress] = useState('');
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [changePasswordStatus, setChangePasswordStatus] = useState(null); // 성공, 실패 여부 상태
    const [profileImgUrl, setProfileImgUrl] = useState('');
    const [defaultProfileImgUrl, setDefaultProfileImgUrl] = useState(''); // 기본 프로필 이미지 URL 설정

    useEffect(() => {
        if (employee) {
            const { postalCode, mainAddress, detailAddress } = splitAddress(employee.address);
            setFormData({
                ...formData,
                email: employee.email || '',
                phone: employee.phone || '',
                bank_name: employee.bank_name || '',
                account_num: employee.account_num || '',
                new_emp_pass: employee.new_emp_pass || '',
            });
            setPostcode(postalCode);
            setMainAddress(mainAddress);
            setDetailAddress(detailAddress);
            setDefaultProfileImgUrl(employee.profile_img_url); // 기본 프로필 이미지 URL 설정
        }
    }, [employee]);

    const handleComplete = (data) => {
        const fullAddress = data.address;
        const { mainAddress, detailAddress } = splitAddress(fullAddress);

        setFormData({
            ...formData,
        });

        setPostcode(data.zonecode);
        setMainAddress(mainAddress);
        setDetailAddress(detailAddress);
        setPostcodeOpen(false);
    };

    // 비밀번호 변경 팝업 열기
    const openPasswordPopup = () => {
        setShowPasswordPopup(true);
    };

    // 비밀번호 변경 팝업 닫기
    const closePasswordPopup = () => {
        setShowPasswordPopup(false);
        // 팝업이 닫힐 때 입력 값 초기화
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setChangePasswordStatus(null); // 상태 초기화
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'mainAddress') {
            setMainAddress(value);
        } else if (name === 'detailAddress') {
            setDetailAddress(value);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImgUrl(reader.result); // 이미지 미리보기를 위해 URL을 상태에 저장
        };
        if (file) {
            reader.readAsDataURL(file);
        }
        setFormData({
            ...formData,
            emp_img: file
        });
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const passwordData = {
                emp_pass: currentPassword, // 기존 비밀번호
                new_emp_pass: newPassword // 새로운 비밀번호
            };

            // 비밀번호 변경 API 호출
            await dispatch(callUpdateMyInfoAPI(passwordData));
            setChangePasswordStatus('success');
            alert('비밀번호가 성공적으로 변경되었습니다.');
            setShowPasswordPopup(false);
        } catch (error) {
            console.error('비밀번호 변경에 실패하였습니다:', error);
            setChangePasswordStatus('fail');
            alert('비밀번호 변경에 실패하였습니다.');
        }
    };

    const handleProfileImgUpload = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('empCode', employee.emp_code);
        formDataToSend.append('profileImg', formData.emp_img);
    
        try {
            await dispatch(callUploadProfileImgAPI(formDataToSend));
            await dispatch(callGetProfileImgAPI(employee.emp_code)); // 업로드 후 프로필 이미지 다시 가져오기
            alert("프로필 이미지 업로드에 성공하였습니다");
        } catch (error) {
            console.error("프로필 이미지 업로드에 실패하였습니다:", error);
            alert("프로필 이미지 업로드에 실패하였습니다");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFormData = {
            ...formData,
            address: `${postcode} ${mainAddr} ${detailAddr}`,
        };

        try {
            await dispatch(callUpdateMyInfoAPI(updatedFormData));
            await dispatch(callMyInfoAPI());
            alert("내 정보 변경에 성공하였습니다");
        } catch (error) {
            console.error("내 정보 업데이트에 실패하였습니다:", error);
            alert("내 정보 변경에 실패하였습니다");
        }
    };

    // 주소 분리 함수
    const splitAddress = (address) => {

        if (!address) return { postalCode: '', mainAddress: '', detailAddress: '' };

        // 우편번호를 구하기 위해 첫 번째 공백 이전까지 자름
        const postalCode = address.split(' ')[0];

        // 주소 부분을 구하기 위해 우편번호 다음부터 끝까지 자름
        const addressPart = address.substring(postalCode.length).trim();

        // 주소에서 마지막 단어가 숫자라면 상세주소로 간주
        const lastWord = addressPart.split(' ').pop();
        const isLastWordNumber = !isNaN(lastWord);

        // 상세주소를 구하기 위해 주소에서 마지막 단어 이후를 자름
        const mainAddress = isLastWordNumber ? addressPart.substring(0, addressPart.lastIndexOf(' ')).trim() : addressPart;
        const detailAddress = isLastWordNumber ? lastWord : '';

        return { postalCode, mainAddress, detailAddress };
    };

    // /* 기본 프로필 이미지 경로 설정 */
    // const profileImgUrl = employee?.emp_img ? `${process.env.PUBLIC_URL}/${employee.emp_img}` : `${process.env.PUBLIC_URL}/images/profileImg/profileImg.png`;

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">나의 프로필</h4>
            <section className="bl_sect hp_padding15">
                <h5 className="hp_fw700 hp_fs18 hp_mb10">기본정보</h5>
                <table className="bl_tb3">
                    <colgroup>
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "*" }} />
                        <col style={{ width: "150px" }} />
                        <col style={{ width: "*" }} />
                    </colgroup>
                    <tbody key={employee.emp_code}>
                        <tr>
                            <th rowspan="3" className="hp_padding0">
                                {/* <div className="el_profile__img" style={{ backgroundImage: `url(${profileImgUrl})`, height: "180px", width: "150px" }}></div> */}
                                {/* style={{ backgroundImage: `url(${profileImgUrl || defaultProfileImgUrl})`, height: "180px", width: "150px", backgroundSize: 'cover', backgroundPosition: 'center' }} */}
                                <div className="el_profile__img">
                                    <img src={profileImg} alt="프로필 사진" style={{height: "200px", width: "150px"}} />
                                </div>
                                {/* <div>
                                    <button type="button" className="el_btnS el_btnblueBack" onClick={handleProfileImgUpload} >저장</button>
                                </div> */}
                            </th>
                            <th >이름</th>
                            <td>{employee.emp_name}</td>
                            <th >입사일</th>
                            <td>{employee.hire_date}</td>
                        </tr>
                        <tr>
                            <th >사원번호</th>
                            <td>{employee.emp_code}</td>
                            <th >직통번호</th>
                            <td>{employee.direct_line}</td>
                        </tr>
                        <tr>
                            <th >부서</th>
                            <td>{employee.dept_title}</td>
                            <th >직급</th>
                            <td>{employee.position_name}</td>
                        </tr>
                        <tr>
                            <th >이메일</th>
                            <td colspan="4">
                                <input type="text" className="hp_w100" name='email' value={formData.email} onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th >휴대폰</th>
                            <td colspan="4">
                                <input type="text" className="hp_w100" name='phone' value={formData.phone} onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th >주소</th>
                            <td colspan="4">
                                <div className="ly_flex">
                                    <input type="button" className="hp_ml10 el_btnblueBord" value="우편번호 검색" onClick={() => setPostcodeOpen(true)} />
                                    <input type="text" className="hp_w100" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                                </div>
                                <input type="text" className="hp_w100 hp_mt10" value={mainAddr} onChange={(e) => setMainAddress(e.target.value)} />
                                <input type="text" className="hp_w100 hp_mt10" value={detailAddr} onChange={(e) => setDetailAddress(e.target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <th>프로필 이미지</th>
                            <td colSpan="4">
                                <input type="file" className="hp_w100" name='emp_img' onChange={handleFileChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <h5 className="hp_fw700 hp_fs18 hp_mb10 hp_mt30">부가정보</h5>
                <table className="bl_tb3">
                    <colgroup>
                        <col style={{ width: "calc(100%/3)" }} />
                        <col style={{ width: "calc(100%/3)" }} />
                        <col style={{ width: "calc(100%/3)" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">사원번호</th>
                            <th scope="col">급여은행</th>
                            <th scope="col">급여계좌</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: 'center' }}>{employee.emp_code}</td>
                            <td>
                                <select className="hp_w100" id="bankName" name='bank_name' value={formData.bank_name} onChange={handleChange} >
                                    <option >선택</option>
                                    <option value="KEB하나은행">KEB하나은행</option>
                                    <option value="SC제일은행">SC제일은행</option>
                                    <option value="국민은행">국민은행</option>
                                    <option value="신한은행">신한은행</option>
                                    <option value="외환은행">외환은행</option>
                                    <option value="우리은행">우리은행</option>
                                    <option value="한국시티은행">한국시티은행</option>
                                    <option value="기업은행">기업은행</option>
                                </select>
                            </td>
                            <td>
                                <input type="text" className="hp_w100" style={{ textAlign: 'center' }} name='account_num' value={formData.account_num} onChange={handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <div className="hp_alignR hp_mt10">
                <button type="button" className="el_btnS el_btnblueBack" onClick={handleSubmit}>저장</button>
                <button type="button" className="el_btnS el_btn0Back hp_ml5" onClick={openPasswordPopup}>비밀번호 변경</button>
                {postcodeOpen && (
                    <div className="bl_popup">
                        <div className="bl_popWrap">
                            <div className="bl_popHead ly_spaceBetween ly_fitemC">
                                <div className="hp_fs18">우편번호 검색</div>
                                <button type="button" className="bl_popup__closeBtn" onClick={() => setPostcodeOpen(false)}></button>
                            </div>
                            <div className="hp_padding30">
                                <DaumPostcode onComplete={handleComplete} />
                            </div>
                        </div>
                    </div>
                )}
                {showPasswordPopup && (
                    <div className="bl_popBack">
                        <div className="bl_popup">
                            <div className="bl_popWrap">
                                <div className="bl_popHead ly_spaceBetween ly_fitemC">
                                    <div className="hp_fs18">비밀번호 변경</div>
                                    <button type="button" className="bl_popup__closeBtn" onClick={closePasswordPopup}></button>
                                </div>
                                <div className="hp_padding30">
                                    <table className="bl_tb3">
                                        <colgroup>
                                            <col style={{ width: "150px" }} />
                                            <col style={{ width: "*" }} />
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th scope="row">기존 비밀번호</th>
                                                <td><input type="password" className="hp_w100 " value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">새 비밀번호</th>
                                                <td><input type="password" className="hp_w100 " value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row">새 비밀번호 확인</th>
                                                <td><input type="password" className="hp_w100 " value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="hp_marginAuto hp_mt20 hp_alignC">
                                        <button type="button" className="el_btnS el_btn8Back" onClick={closePasswordPopup}>취소</button>
                                        <button type="button" className="el_btnS el_btnblueBack hp_ml5" onClick={handleChangePassword}>변경</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export default MyInfo;
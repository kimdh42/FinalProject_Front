import { useState } from "react";
import Line from "./Line";
import AddressDir from './../../components/commons/address/AddressDir';

function FormLine({handleTrueLineList, docInfo = {}, onedoc = {}}){
    // 모달창 오픈
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // 모달창에서 가져온 인원 배열
    const [selectEmps, setSelectEmps] = useState([]);

    // 확인 버튼 핸들러
    const confirmHandler = (newSelectEmps) => {
        setSelectEmps(prev => {
            const existingEmpCodes = prev.map(emp => emp.emp_code);
            const filteredNewSelectEmps = newSelectEmps.filter(emp => !existingEmpCodes.includes(emp.emp_code));
            return [...prev, ...filteredNewSelectEmps];
        });
        closeModal();
    }

    // 삭제 인원 반영
    const clearReceiver = () => {
        setSelectEmps([]);
    }

    console.log("selectEmps", selectEmps);

    return(
        <>
            <div className="ly_spaceBetween hp_mb10">
                <h5 className="hp_fw700 hp_fs18">결재라인</h5>
                <button type="button" className="el_btnS el_btn8Bord hp_p3-5" onClick={openModal}>결재라인 수정</button>
                <AddressDir isOpen={isModalOpen} closeModal={closeModal} onConfirm={confirmHandler} onClear={clearReceiver}/>
            </div>
            <div className="ly_flex hp_relative">
                <table className="bl_tb3 hp_alignC hp_w200px ly_fshirnk">
                    <tbody>
                        <tr>
                            <th>구분</th>
                        </tr>
                        <tr>
                            <th>결재상태</th>
                        </tr>
                        <tr>
                            <th>소속</th>
                        </tr>
                        <tr>
                            <th>직위</th>
                        </tr>
                        <tr>
                            <th>이름</th>
                        </tr>
                        <tr>
                            <th>서명</th>
                        </tr>
                    </tbody>
                </table>
                <Line handleTrueLineList={handleTrueLineList} docInfo={docInfo} onedoc={onedoc} selectEmps={selectEmps}/>
            </div>
        </>
    )
}
export default FormLine;
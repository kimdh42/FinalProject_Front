import '../../css/approval.css';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import { callFormListAPI } from '../../apis/ApprovalAPICalls';
import Form from './Form';

function FormList(){
    const dispatch = useDispatch();
    const {forms} = useSelector(state => state.approvalReducer);

    useEffect(() => {
        dispatch(callFormListAPI());
    }, []);

    const filteredForms = forms.filter(item => item.afActive !== "N");

    return(
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">작성하기</h4>
            {forms && <Form data={filteredForms}/>}
        </div>
    )
}

export default FormList;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormItem({form: {afCode, afName, afExplain, lsCode}}){
    const navigate = useNavigate();
    const [title, setTitle] = useState();

    const onClickHandler = () => {
        navigate(`/approval/form/${afCode}`, {state: {afName, lsCode}});
    }

    return(
        <>
            <button className="el_draftApply" onClick={onClickHandler}>
                {afName}
                {afExplain && <b className="hp_7Color">({afExplain})</b>}
            </button>
        </>
    )
}
export default FormItem;
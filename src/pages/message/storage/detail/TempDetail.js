import { useParams } from "react-router";
import CreateTable from "../table/CreateTable";


function TempDetail() {

    const { msgCode } = useParams();

    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">쪽지쓰기</h4>
            <section className="bl_sect hp_padding15">
                <CreateTable msgCode={msgCode}/>
            </section>
        </div>
    );
}

export default TempDetail;
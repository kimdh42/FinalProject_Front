import BinTable from "./table/BinTable";
import { useState } from "react";

function Bin() {

    const [currentPage, setCurrentPage] = useState(1);
    
    return (
        <div className="ly_cont">
            <h4 className="el_lv1Head hp_mb30">휴지통</h4>
            <BinTable currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
}

export default Bin;
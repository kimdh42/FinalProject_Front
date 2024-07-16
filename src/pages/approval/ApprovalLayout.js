import { Outlet } from "react-router-dom";
import ApprovalNav from "../../components/commons/ApprovalNav";

function ApprovalLayout(){
    return(
        <>
            <ApprovalNav/>
            <Outlet/>
        </>
    )
}
export default ApprovalLayout;
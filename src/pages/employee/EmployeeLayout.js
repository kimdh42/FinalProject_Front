import { Outlet } from "react-router-dom";
import EmployeeNav from "../../components/commons/EmployeeNav";

function EmployeeLayout(){
    return(
        <>
            <EmployeeNav/>
            <Outlet/>
        </>
    )
}
export default EmployeeLayout;
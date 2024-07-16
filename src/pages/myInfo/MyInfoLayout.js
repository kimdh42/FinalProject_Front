import { Outlet } from "react-router-dom";
import MyInfoNav from "../../components/commons/MyInfoNav";

function MyInfoLayout(){
    return(
        <>
            <MyInfoNav/>
            <Outlet/>
        </>
    )
}
export default MyInfoLayout;
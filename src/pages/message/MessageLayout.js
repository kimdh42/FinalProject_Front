import { Outlet } from "react-router-dom";
import MessageNav from "../../components/commons/MessageNav";

function MessageLayout(){
    return(
        <>
            <MessageNav/>
            <Outlet/>
        </>
    )
}
export default MessageLayout;
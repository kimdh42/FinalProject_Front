import { Outlet } from "react-router-dom";
import Calendarnav from "../../components/commons/CalendarNav";

function CalendarLayout(){
    return(
        <>
            <Calendarnav/>
            <Outlet/>
        </>
    )
}
export default CalendarLayout;
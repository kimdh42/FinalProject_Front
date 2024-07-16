import { Outlet } from "react-router-dom";
import Header from "../commons/Header";

function Layout(){
    return(
        <div className="ly_all">
            <Header/>
            <div className="ly_body">
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout;
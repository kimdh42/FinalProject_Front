import { Outlet } from "react-router-dom";
import PostNav from "../../components/commons/PostNav";

function PostLayout(){
    return(
        <>
            <PostNav/>
            <Outlet/>
        </>
    )
}
export default PostLayout;
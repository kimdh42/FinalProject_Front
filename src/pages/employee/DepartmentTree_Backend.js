import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";


function DepartmentTree_Backend() {
    return (
        <DndProvider backend={HTML5Backend}>
            <Tree {...somProps} />
        </DndProvider>
    );
}

export default DepartmentTree_Backend;
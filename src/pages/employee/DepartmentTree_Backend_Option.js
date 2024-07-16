import { DndProvider } from "react-dnd";
import {Tree, MultiBackend, getBackendOptions} from "@minoru/react-dnd-treeview"



const multiOptions = {
    touch: touchOptions,
    html5: html5Options,
  }

function DepartmentTree_Backend_Option() {
    return (
        <DndProvider
            backend={MultiBackend}
            options={getBackendOptions(multiOptions)}
        >
            <Tree {...someProps} />
        </DndProvider>
    );
}

export default DepartmentTree_Backend_Option;
import { MultiBackend, getBackendOptions, Tree } from "@minoru/react-dnd-treeview";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
// import initaialData from "./sample-default.json";
import { useDispatch, useSelector } from "react-redux";
import { callDeleteDeptRelationsAPI, callDeptDetailAPI, callModifyDeptRelationsAPI, callRegistDeptRelationsAPI } from "../../apis/EmployeeAPICalls.js";
import TreeCustomNode from "./TreeCustomNode.js";


// npm i react-dnd @minoru/react-dnd-treeview 이거 설치해야함

function DepartmentTree({ addNewDept, newDeptTitle, handleNewDeptNameChange, handleNewDeptSubmit }) {
    
    const dispatch = useDispatch();
    const departments = useSelector (state => state.employeeReducer.departments);
    // console.log('departments in component: ', departments);
      
    const [treeData, setTreeData] = useState([]);

    
    useEffect(() => {
        if (departments.length > 0) {
            const converedData = departments.map(department => ({
                id: department.dept_code,       // 부서코드
                parent: department.parDeptCodes.length === 0 ? 0 : department.parDeptCodes[0],      // 부모 부서 코드 설정
                droppable: true,        // 드래그 가능 여부
                text: department.dept_title     // 부서명
            }));
            setTreeData(converedData);
        }
    }, [departments]);
    
    const handleDrop = (newTreeData) => {
      setTreeData(newTreeData);
  
      newTreeData.forEach(node => {
          const originalNode = treeData.find(originNode => originNode.id === node.id);
  
          if (originalNode && originalNode.parent !== node.parent) {
              // 기존 관계 삭제
              dispatch(callDeleteDeptRelationsAPI(originalNode.parent, node.id));
  
              // deptRelationsCode가 정의되지 않았을 경우에 대한 처리
              if (node.deptRelationsCode) {
                  // 이미 저장된 관계는 수정
                  dispatch(callModifyDeptRelationsAPI(node.parent, node.id, node.deptRelationsCode));
              } else {
                  // 저장되지 않은 관계는 등록
                  dispatch(callRegistDeptRelationsAPI(node.parent, node.id));
              }
          } else if (!originalNode) {
              // 저장되지 않은 관계는 등록
              dispatch(callRegistDeptRelationsAPI(node.parent, node.id));
          }
      });
  };

    const handleNodeClick = (nodeId) => {

      console.log('Clicked nodeId:', nodeId); // 노드 클릭 확인

      const selectedDepartment = departments.find(department => department.dept_code === nodeId);
      
      console.log('Selected department:', selectedDepartment);

      if (selectedDepartment) {
        dispatch(callDeptDetailAPI(selectedDepartment.dept_code));
      }
    };

    return (
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Tree
            tree={treeData}
            rootId={0}
            onDrop={handleDrop}
            render={(node, { depth, isOpen, onToggle }) => (
              <div style={{ marginLeft: depth * 10 }}>
                <TreeCustomNode
                node={node}
                depth={depth}
                isOpen={isOpen}
                onToggle={onToggle}
                onNodeClick={() => handleNodeClick(node.id)} />
              </div>
            )}
          />
          {addNewDept && (
                <div style={{ marginLeft: 20 }}>
                    <input
                        type="text"
                        value={newDeptTitle}
                        onChange={handleNewDeptNameChange}
                        onKeyDown={handleNewDeptSubmit}
                        placeholder="새 부서명 입력"
                    />
                </div>
            )}
        </DndProvider>
      );
    }

export default DepartmentTree;
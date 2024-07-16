const createNode = (dept) => ({
    id: dept.dept_code,
    parentId: dept.parDeptCodes || [],
    name: dept.dept_title,
    children: [], // Ensure children array is initialized
  });
  
  // 예시 데이터 변환 함수
  export const transformDepartmentData = (departments) => {
    const deptMap = {};
    const rootNodes = [];

    departments.forEach((dept) => {
        deptMap[dept.dept_code] = createNode(dept);
    });

    departments.forEach((dept) => {
        if (!dept.subDeptCodes) {
            dept.subDeptCodes = []; // Ensure subDeptCodes array exists
        }

        dept.subDeptCodes.forEach((childId) => {
            if (deptMap[childId]) {
                deptMap[dept.dept_code].children.push(deptMap[childId]);
            } else {
                console.error(`부서 코드 ${childId}에 해당하는 자식 노드를 찾을 수 없습니다.`);
            }
        });

        if (dept.parDeptCodes.length === 0) {
            rootNodes.push(deptMap[dept.dept_code]);
        }
    });

    return { rootNodes };
};


  
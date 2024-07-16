export const transformData = (orgChart) => {
  let rootEmployee = null;

  // 1. 루트 노드 찾기
  orgChart.forEach(employee => {
    if (employee.dept_code === "D1" && employee.position_code === "P1") {
      rootEmployee = {
        empCode: employee.emp_code,
        name: employee.emp_name,
        attributes: {
          dept: employee.dept_title,
          positionName: employee.position_name,
          Img: employee.emp_img || `/images/profileImg/profileImg.png`
        },
        children: [] // 루트 노드의 자식 초기화
      };
    }
  });

  // 루트 노드가 없으면 종료
  if (!rootEmployee) {
    console.error("Root employee not found.");
    return null;
  }

  // 부서 코드를 기반으로 부서맵 생성
  const deptMap = {};

  // 2. 모든 직원 데이터를 반복하여 구조화된 형태로 변환
  orgChart.forEach(employee => {
    const { emp_code, emp_name, dept_code, par_dept_code, sub_dept_code, position_code } = employee;

    const uniqueDeptCode = `${dept_code}-${emp_code}`;

    // 부서맵에 부서 코드가 없으면 새로운 부서 추가
    if (!deptMap[uniqueDeptCode]) {
      deptMap[uniqueDeptCode] = {
        empCode: emp_code,
        name: emp_name,
        attributes: {
          dept: employee.dept_title,
          positionName: employee.position_name,
          Img: employee.emp_img || `/images/profileImg/profileImg.png`
        },
        children: [] // 자식 배열 초기화
      };
    }

    // par_dept_code를 기준으로 부모-자식 관계 처리
    if (par_dept_code) {
      const parentDeptCodes = Object.keys(deptMap).filter(code => code.startsWith(par_dept_code));
      parentDeptCodes.forEach(parentDeptCode => {
        const parentEmployee = deptMap[parentDeptCode]; // Use deptMap to find parent
        if (parentEmployee) {
          // Check if the parent already has a child with the same empCode
          if (!parentEmployee.children.some(child => child.empCode === emp_code)) {
            parentEmployee.children.push(deptMap[uniqueDeptCode]); // Push the correct child node
          }
        }
      });
    }

    // sub_dept_code를 기준으로 하위 부서 처리
    if (sub_dept_code) {
      const subDepts = sub_dept_code.split(", ");
      subDepts.forEach(subDept => {
        const subDeptCodes = Object.keys(deptMap).filter(code => code.startsWith(subDept));
        subDeptCodes.forEach(subDeptCode => {
          if (deptMap[subDeptCode] && !deptMap[uniqueDeptCode].children.some(child => child.empCode === deptMap[subDeptCode].empCode)) {
            deptMap[uniqueDeptCode].children.push(deptMap[subDeptCode]); // Push the correct child node
          }
        });
      });
    }
  });

  // 3. 루트에 부서 정보 추가 (루트 부서의 직속 자식만 추가)
  orgChart.forEach(employee => {
    if (employee.par_dept_code === "D1" && rootEmployee.empCode !== employee.emp_code) {
      const uniqueDeptCode = `${employee.dept_code}-${employee.emp_code}`;
      if (deptMap[uniqueDeptCode]) {
        rootEmployee.children.push(deptMap[uniqueDeptCode]);
      }
    }
  });

  // 4. 각 부서의 직급 코드 기준으로 정렬하기
  const sortChildrenByPositionCode = (node) => {
    if (!node.children || node.children.length === 0) {
      return node;
    }

    // 직급 코드 순서 배열
    const positionOrder = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']; // 예시, 필요에 따라 수정할 것

    // 부서의 직급 코드를 기준으로 정렬
    node.children.sort((a, b) => {
      return positionOrder.indexOf(a.attributes.positionName) - positionOrder.indexOf(b.attributes.positionName);
    });

    // 정렬된 각 자식에 대해 재귀적으로 정렬 적용
    node.children.forEach(child => {
      sortChildrenByPositionCode(child);
    });

    return node;
  };

  // 루트 노드부터 정렬 적용
  rootEmployee = sortChildrenByPositionCode(rootEmployee);

  // 중복 제거 함수
  function removeDuplicates(node) {
    if (!node.children || node.children.length === 0) {
      return node;
    }

    let empCodeSet = new Set();
    let newChildren = [];

    for (let child of node.children) {
      if (!empCodeSet.has(child.empCode)) {
        empCodeSet.add(child.empCode);
        newChildren.push(removeDuplicates(child));
      }
    }

    node.children = newChildren;
    return node;
  }

  // 중복 제거 함수 호출
  if (rootEmployee) {
    rootEmployee = removeDuplicates(rootEmployee);
  }

  console.log('rootEmployee', rootEmployee);

  return rootEmployee;
};

export default transformData;

















// 샘플 데이터

// const orgChart = [
//   {
//     emp_code: 2021011,
//     par_code: 2021011,
//     emp_name: "이재현",
//     dept_code: "D3",
//     dept_title: "경영지원부",
//     position_code: "P2",
//     position_name: "이사",
//     title_name: "책임자",
//     phone: "010-3456-7890",
//     hire_date: "2021-01-10",
//     emp_status: "Y",
//     social_security_no: "1992-03-03",
//     emp_img: null,
//     par_dept_code: "D1",
//     sub_dept_code: "D4, D13"
//   },
//   // 다른 조직원들의 데이터...
// ];

// const myTreeData = [
//   {
//     name: "Gaurang Torvekar",
//     attributes: {
//       keyA: "val A",
//       keyB: "val B",
//       keyC: "val C"
//     },
//     children: [
//       {
//         name: "Avadhoot",
//         attributes: {
//           keyA: "val A",
//           keyB: "val B",
//           keyC: "val C"
//         },
//         children: [
//           {
//             name: "Richard"
//           },
//           {
//             name: "Constantine",
//             children: [
//               {
//                 name: "Mia"
//               }
//             ]
//           },
//           {
//             name: "Daniel"
//           }
//         ]
//       },
//       {
//         name: "Mia"
//       },
//       {
//         name: "Varun",
//         attributes: {
//           keyA: "val A",
//           keyB: "val B",
//           keyC: "val C"
//         },
//         children: [
//           {
//             name: "Ivo",
//             attributes: {
//               keyA: "val A",
//               keyB: "val B",
//               keyC: "val C"
//             },
//             children: [
//               {
//                 name: "Level 2: A",
//                 attributes: {
//                   keyA: "val A",
//                   keyB: "val B",
//                   keyC: "val C"
//                 },
//                 children: [
//                   {
//                     name: "Level 2: A",
//                     attributes: {
//                       keyA: "val A",
//                       keyB: "val B",
//                       keyC: "val C"
//                     }
//                   },
//                   {
//                     name: "Level 2: B"
//                   }
//                 ]
//               },
//               {
//                 name: "Level 2: B"
//               }
//             ]
//           },
//           {
//             name: "Vijay"
//           }
//         ]
//       },
//       {
//         name: "Mohit",
//         children: [
//           {
//             name: "Rohit",
//             attributes: {
//               keyA: "val A",
//               keyB: "val B",
//               keyC: "val C"
//             },
//             children: [
//               {
//                 name: "Level 2: A",
//                 attributes: {
//                   keyA: "val A",
//                   keyB: "val B",
//                   keyC: "val C"
//                 },
//                 children: [
//                   {
//                     name: "Level 2: A",
//                     attributes: {
//                       keyA: "val A",
//                       keyB: "val B",
//                       keyC: "val C"
//                     }
//                   },
//                   {
//                     name: "Level 2: B"
//                   }
//                 ]
//               }
//             ]
//           },
//           {
//             name: "Pranav"
//           }
//         ]
//       }
//     ]
//   }
// ];


// const employees =
// [
//   {
//     id: 1,
//     parentId: "",
//     name: "John",
//     positionName: "CEO",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "",
//     description:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//     imageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
//   },
//   {
//     id: 2,
//     parentId: "1",
//     name: "Smith",
//     positionName: "COO",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/20.jpg",
//   },

//   {
//     id: 3,
//     parentId: "1",
//     name: "Kate",
//     positionName: "CTO",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
//   },
//   {
//     id: 4,
//     parentId: "6",
//     team: "HR team",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   },
//   {
//     id: 5,
//     parentId: "3",
//     name: "Erica",
//     positionName: "Manager of something",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/women/8.jpg",
//   },
//   {
//     id: 6,
//     parentId: "3",
//     name: "Paul",
//     positionName: "Manager of something",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/6.jpg",
//   },
//   {
//     id: 7,
//     parentId: "5",
//     team: "Developers",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   },
//   {
//     id: 8,
//     parentId: "3",
//     name: "Tony",
//     positionName: "Manager of something",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 9,
//     parentId: "2",
//     name: "Sally",
//     positionName: "Manager of something",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/women/9.jpg",
//   },
//   {
//     id: 10,
//     parentId: "4",
//     name: "Scott",
//     positionName: "HR assistant",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/10.jpg",
//   },

//   {
//     id: 11,
//     parentId: "1",
//     name: "James",
//     positionName: "CGO",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/7.jpg",
//   },
//   {
//     id: 12,
//     parentId: "4",
//     name: "Tony",
//     positionName: "HR assistant",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 13,
//     parentId: "4",
//     name: "Sally",
//     positionName: "HR assistant",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/women/9.jpg",
//   },
//   {
//     id: 14,
//     parentId: "8",
//     name: "Scott",
//     positionName: "Teacher",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/10.jpg",
//   },

//   {
//     id: 15,
//     parentId: "8",
//     name: "James",
//     positionName: "Teacher",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/7.jpg",
//   },
//   {
//     id: 16,
//     parentId: "7",
//     name: "Tony",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 17,
//     parentId: "7",
//     name: "Sally",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/women/9.jpg",
//   },
//   {
//     id: 18,
//     parentId: "8",
//     name: "Scott",
//     positionName: "Teacher",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/10.jpg",
//   },
//   {
//     id: 19,
//     parentId: "7",
//     name: "Tony",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 20,
//     parentId: "7",
//     name: "Tony",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 21,
//     parentId: "7",
//     name: "Tony",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 22,
//     parentId: "7",
//     name: "Tony",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 23,
//     parentId: "7",
//     name: "Tony",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 24,
//     parentId: "7",
//     name: "Tony",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 25,
//     parentId: "7",
//     name: "Tony",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 26,
//     parentId: "7",
//     name: "Tony",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
//   {
//     id: 27,
//     parentId: "7",
//     name: "Tony",
//     positionName: "Developer",
//     phone: "99887766",
//     email: "employee@email.com",
//     team: "",
//     location: "LA Branch",
//     department: "Marketing",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
//   },
// ];

// export default employees;
import React, { useState, useEffect } from 'react';
import { request } from '../../apis/api';
import AddressDir from '../../components/commons/address/AddressDir';
import { useDispatch, useSelector } from 'react-redux';
import { callMyInfoAPI } from '../../apis/EmployeeAPICalls';

const TaskMain = () => {
    const dispatch = useDispatch();
    const { employee } = useSelector((state) => state.employeeReducer); // Redux store에서 employee 정보 가져오기

    const [isModalOpen, setModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [newTask, setNewTask] = useState({
        title: '',
        modifiedDate: '',
        start: '',
        end: '',
        status: '',
        priority: '',
        description: '',
        owner: 'Johon Taita',
        display: false,
        empCode: employee ? employee.empCode : 2020011, // 로그인한 사용자의 empCode로 설정,
    });

    const [isAddressModalOpen, setAddressModalOpen] = useState(false);
    const [selectEmps, setSelectEmps] = useState([]);
    const [employees, setEmployees] = useState([]);

    const openAddressModal = () => setAddressModalOpen(true);
    const closeAddressModal = () => setAddressModalOpen(false);

    const confirmHandler = (newSelectEmps) => {
        setSelectEmps(prev => {
            const existingEmpCodes = prev.map(emp => emp.emp_code);
            const filteredNewSelectEmps = newSelectEmps.filter(emp => !existingEmpCodes.includes(emp.emp_code));
            return [...prev, ...filteredNewSelectEmps];
        });
        closeAddressModal();
    };

    const clearReceiver = () => {
        setSelectEmps([]);
    };

    useEffect(() => {
        dispatch(callMyInfoAPI());
        fetchTasks();
        fetchEmployees();
    }, [dispatch]);

    const fetchTasks = async () => {
        try {
            const response = await request('GET', '/calendar/tasks', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await request('GET', '/address/select', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });
            setEmployees(response.data);
        } catch (error) {
            console.error('Failed to fetch employees', error);
        }
    };

    const openModal = async (task = null) => {
        if (task) {
            setSelectedTaskId(task.id);
            setNewTask({ ...task });
            loadGuests(task.id);
        } else {
            setSelectedTaskId(null);
            setNewTask({
                title: '',
                modifiedDate: '',
                start: '',
                end: '',
                status: '',
                priority: '',
                description: '',
                owner: 'Johon Taita',
                display: false,
                empCode: employee ? employee.empCode : 2020011, // 로그인한 사용자의 empCode로 설정,
            });
            setSelectEmps([]);
        }
        setModalOpen(true);
    };

    const loadGuests = async (taskId) => {
        try {
            const response = await request('GET', `/api/guests/task/${taskId}`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });
            if (response && response.data) {
                const guestsWithNames = response.data.map(guest => {
                    const employee = employees.find(emp => emp.emp_code === guest.empCode);
                    return {
                        ...guest,
                        emp_name: employee ? employee.emp_name : 'Unknown'
                    };
                });
                setSelectEmps(guestsWithNames);
            } else {
                console.log("Failed to load guests.");
            }
        } catch (error) {
            console.error('Failed to load guests:', error);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTask({
            ...newTask,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async () => {
        try {
            let response;
            if (selectedTaskId) {
                response = await request('PUT', `/calendar/task/${selectedTaskId}`, {
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                }, newTask);
            } else {
                response = await request('POST', '/calendar/task/regist', {
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                }, newTask);
            }

            if (response && response.data && response.data.id) {
                const taskId = response.data.id;

                for (const emp of selectEmps) {
                    const guestData = {
                        empCode: emp.emp_code,
                        taskCode: taskId,
                    };
                    await request('POST', '/api/guests', {
                        'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                        'Content-Type': 'application/json'
                    }, guestData);
                }
            }

            fetchTasks();
            closeModal();
        } catch (error) {
            console.error('Failed to save task', error);
        }
    };

    const handleDelete = async () => {
        try {
            if (selectedTaskId) {
                await request('DELETE', `/calendar/task/${selectedTaskId}`, {
                    'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                });
                fetchTasks();
                closeModal();
            }
        } catch (error) {
            console.error('Failed to delete task', error);
        }
    };

    const isTaskOwner = newTask.empCode === employee.emp_code;
    const isLoginer = newTask.empCode && newTask.empCode === employee.emp_code;


    console.log("로그인한 사용자", employee.emp_code)
    console.log("업무 작성자", newTask.empCode)

    return (
        <div className="ly_cont" style={{ height: 'calc(100vh - 65px)' }}>
            <div className="ly_spaceBetween hp_mb30">
                <h4 className="el_lv1Head">업무</h4>
                {/* <select>
                    <option value="">정렬방식</option>
                </select> */}
            </div>
            <div className="ly_flex bl_task">
                <section className="bl_sect hp_dBack hp_padding15 ly_fgrow1">
                    <div className="ly_spaceBetween">
                        <h5 className="hp_fw700 hp_fs18">업무 대기 </h5>
                        <button type="button" className="el_btnS el_btn0Back" title="등록하기" onClick={() => openModal()}>등록하기 </button>
                    </div>
                    <ul className="bl_taskFeed hp_mt15">
                        {tasks.filter(task => task.status === 'A').map(task => (
                            <TaskItem key={task.id} task={task} onClick={() => openModal(task)} />
                        ))}
                    </ul>
                </section>
                <section className="bl_sect hp_dBack hp_padding15 ly_fgrow1 hp_ml20">
                    <div className="ly_spaceBetween">
                        <h5 className="hp_fw700 hp_fs18">업무 진행중 </h5>
                        <button type="button" className="el_btnS el_btn0Back" title="등록하기" onClick={() => openModal()}>등록하기 </button>
                    </div>
                    <ul className="bl_taskFeed hp_mt15">
                        {tasks.filter(task => task.status === 'B').map(task => (
                            <TaskItem key={task.id} task={task} onClick={() => openModal(task)} />
                        ))}
                    </ul>
                </section>
                <section className="bl_sect hp_dBack hp_padding15 ly_fgrow1 hp_ml20">
                    <div className="ly_spaceBetween">
                        <h5 className="hp_fw700 hp_fs18">업무 완료 </h5>
                        <button type="button" className="el_btnS el_btn0Back" title="등록하기" onClick={() => openModal()}>등록하기 </button>
                    </div>
                    <ul className="bl_taskFeed hp_mt15">
                        {tasks.filter(task => task.status === 'C').map(task => (
                            <TaskItem key={task.id} task={task} onClick={() => openModal(task)} />
                        ))}
                    </ul>
                </section>
            </div>
            {isModalOpen && (
                <div className="bl_popBack">
                    <div className="bl_popup hp_w600px">
                        <div className="bl_popWrap">
                            <div className="bl_popHead ly_spaceBetween ly_fitemC">
                                <div className="hp_fs18">업무 {selectedTaskId ? '수정' : '등록'}</div>
                                <button type="button" className="bl_popup__closeBtn" onClick={closeModal}></button>
                            </div>
                            <div className="hp_padding10">
                                <table className="bl_tb3">
                                    <colgroup>
                                        <col style={{ width: '100px' }} />
                                        <col style={{ width: '*' }} />
                                        <col style={{ width: '100px' }} />
                                        <col style={{ width: '*' }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th scope="row">제목</th>
                                            <td colSpan="3"><input type="text" className="hp_w100" name="title" value={newTask.title} onChange={handleInputChange} /></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">시작일</th>
                                            <td>
                                                <input type="date" className="hp_w100" name="start" value={newTask.start} onChange={handleInputChange} />
                                            </td>
                                            <th scope="row">종료일</th>
                                            <td>
                                                <input type="date" className="hp_w100" name="end" value={newTask.end} onChange={handleInputChange} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">상태</th>
                                            <td>
                                                <select className="hp_w100" name="status" value={newTask.status} onChange={handleInputChange}>
                                                    <option value="">선택</option>
                                                    <option value="A">업무대기</option>
                                                    <option value="B">업무진행중</option>
                                                    <option value="C">업무완료</option>
                                                </select>
                                            </td>
                                            <th scope="row">우선 순위</th>
                                            <td>
                                                <select className="hp_w100" name="priority" value={newTask.priority} onChange={handleInputChange}>
                                                    <option value="">선택</option>
                                                    <option value="L">낮음</option>
                                                    <option value="M">중간</option>
                                                    <option value="H">높음</option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">내용</th>
                                            <td colSpan="3"><textarea className="hp_w100" name="description" placeholder="내용을 입력해주세요" value={newTask.description} onChange={handleInputChange}></textarea></td>
                                        </tr>
                                        {!newTask.empCode && (
                                            <tr>
                                                <th scope="row">담당자</th>
                                                <td>
                                                    <button type="button" className="el_btnS el_btn8Bord hp_p3-5" onClick={openAddressModal}>담당자 추가 </button>
                                                    {selectEmps.map((emp, index) => (
                                                        <span key={emp.emp_code}>
                                                            {index > 0 && ", "}
                                                            {emp.emp_name}
                                                        </span>
                                                    ))}
                                                </td>
                                            </tr>
                                        )}
                                        {isLoginer && (
                                             <tr>
                                             <th scope="row">담당자</th>
                                             <td>
                                                 <button type="button" className="el_btnS el_btn8Bord hp_p3-5" onClick={openAddressModal}>담당자 추가 </button>
                                                 {selectEmps.map((emp, index) => (
                                                     <span key={emp.emp_code}>
                                                         {index > 0 && ", "}
                                                         {emp.emp_name}
                                                     </span>
                                                 ))}
                                             </td>
                                         </tr>
                                        )}
                                        {/* <tr>
                                            <th scope="row">캘린더 표시</th>
                                            <td><input type="checkbox" className="hp_w100" name="display" checked={newTask.display} onChange={handleInputChange} /></td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                            
                                <div className="hp_alignC hp_mb20 hp_mt10">
                                    {selectedTaskId ? (
                                        isTaskOwner && (
                                        <>
                                            <button type="button" className="el_btnM el_btnblueBord" onClick={handleSubmit}>수정</button>
                                            <button type="button" className="el_btnM el_btnredBack" onClick={handleDelete}>삭제</button>
                                        </>
                                        )
                                    ) : (
                                        <button type="button" className="el_btnM el_btnblueBack" onClick={handleSubmit}>등록</button>
                                    )}
                                </div>
                            
                        </div>
                    </div>
                </div>
            )}
            <AddressDir isOpen={isAddressModalOpen} closeModal={closeAddressModal} onConfirm={confirmHandler} onClear={clearReceiver} />
        </div>
    );
};

const TaskItem = ({ task, onClick }) => {
    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'L':
                return '낮음';
            case 'M':
                return '중간';
            case 'H':
                return '높음';
            default:
                return priority;
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'L':
                return 'bl_taskFeed__labelLow';
            case 'M':
                return 'bl_taskFeed__labelMiddle';
            case 'H':
                return 'bl_taskFeed__labelHigh';
            default:
                return '';
        }
    };

    return (
        <li className="bl_taskFeed__wrap" onClick={onClick}>
            <div className="ly_flex ly_fitemC">
                <div className="bl_taskFeed__profile" style={{ backgroundImage: "url('../images/profileImg/profileImg.PNG')" }}></div>
                <p className="bl_taskFeed__ttl">{task.title}</p>
            </div>
            <div className="ly_spaceBetween hp_mt20">
                <p className="bl_taskFeed__date">{task.start} - {task.end}</p>
                <p className={`bl_taskFeed__label ${getPriorityClass(task.priority)}`}>{getPriorityLabel(task.priority)}</p>
            </div>
        </li>
    );
};

export default TaskMain;

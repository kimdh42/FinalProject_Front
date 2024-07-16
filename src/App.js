import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layouts/Layout';
import Main from './pages/Main';
import FormList from './pages/approval/FormList';
import Temporary from './pages/approval/Temporary';
import Form from './pages/approval/setting/Form';
import Sign from './pages/approval/setting/Sign';
import Storage from './pages/approval/setting/Storage';
import ApprovalLayout from './pages/approval/ApprovalLayout';
import AttendanceLayout from './pages/attendance/AttendanceLayout';
import CalendarLayout from './pages/calendar/CalendarLayout';
import EmployeeLayout from './pages/employee/EmployeeLayout';
import MessageLayout from './pages/message/MessageLayout';
import PostLayout from './pages/post/PostLayout';
import PostListView from './pages/post/PostListView';
import PostCreateView from './pages/post/PostCreateView';
import FormDetail from './pages/approval/FormDetail';
import PostListViewInBoard from './pages/post/PostListViewInBoard';
import PostDetailView from './pages/post/PostDetailView';
import BoradCreateView from './pages/post/BoardCreateView';
import DocumentMain from './pages/approval/send/DocumentMain'
import Login from './pages/Login';
import 'react-toastify/ReactToastify.css';
import ReceiveMsg from './pages/message/storage/ReceiveMsg';
import SendMsg from './pages/message/storage/SendMsg';
import TempMsg from './pages/message/storage/TempMsg';
import MyCalendar from './pages/calendar/MyCalendar';
import Organization from './pages/employee/Organization';
import PersonalList from './pages/employee/PersonalList';
import PersonalRegist from './pages/employee/PersonalRegist';
import PersonalView from './pages/employee/PersonalView';
import EmployeeList from './pages/employee/EmployeeList';
import AppointList from './pages/employee/AppointList';
import AppointRegist from './pages/employee/AppointRegist';
import AppointView from './pages/employee/AppointView';
import DeptManagerMent from './pages/employee/DeptManagerMent';
import MyInfo from './pages/myInfo/MyInfo';
import MyInfoLayout from './pages/myInfo/MyInfoLayout';
import MyPersonalRecordCard from './pages/myInfo/MyPersonalRecordCard';
import PostEditView from './pages/post/PostEditView'
import ViewMain from './pages/approval/view/ViewMain';
import ReceiveMain from './pages/approval/receive/ReceiveMain';
import FormView from "./pages/approval/setting/FormView";
import BoxMain from "./pages/approval/personalBox/BoxMain";
import ImpMsg from './pages/message/storage/ImpMsg';
import WorkMsg from './pages/message/storage/WorkMsg';
import Bin from './pages/message/storage/Bin';
import PostReadyList from './pages/post/PostReadyList';
import RevDetail from './pages/message/storage/detail/RevDetail';
import SendDetail from './pages/message/storage/detail/SendDetail';
import ImpDetail from './pages/message/storage/detail/ImpDetail';
import WorkDetail from './pages/message/storage/detail/WorkDetail';
import BinDetail from './pages/message/storage/detail/BinDetail';
import MyAttendance from "./pages/attendance/MyAttendance";
import AttendanceList from "./pages/attendance/attendanceList";
import MyDayOff from "./pages/attendance/MyDayOff";
import DayOffList from "./pages/attendance/DayOffList";
import Preferences from "./pages/attendance/Preferences";
import CreateMsg from './pages/message/storage/CreateMsg';
import TempDetail from './pages/message/storage/detail/TempDetail';
import TaskMain from './pages/calendar/TaskMain';
import SettingStor from './pages/message/storage/SettingStor';
import BlockEmp from './pages/message/storage/BlockEmp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login/>}/>
        <Route path='/' element={<Layout/>}>
          <Route path='main' element={<Main/>}/>
          <Route path="approval" element={<ApprovalLayout/>}>
            <Route path="formList" element={<FormList/>} />
            <Route path="temporary" element={<Temporary/>} />
            <Route path="form/:afCode" element={<FormDetail/>}/>
            <Route path="send/:status" element={<DocumentMain/>}/>
            <Route path="receive/:status" element={<ReceiveMain/>}/>
            <Route path="view/:adCode" element={<ViewMain/>}/>
            <Route path="personalBox/:abName" element={<BoxMain/>}/>
            <Route path="setting">
              <Route path="form" element={<Form/>} />
              <Route path="formView/:afCode?" element={<FormView/>} />
              <Route path="sign" element={<Sign/>} />
              <Route path="storage" element={<Storage/>} />
            </Route>
          </Route>
          <Route path="attendance" element={<AttendanceLayout/>}>
            <Route path="myAttendance" element={<MyAttendance/>} />
            <Route path="attendanceList" element={<AttendanceList/>} />
            <Route path="myDayOff" element={<MyDayOff/>} />
            <Route path="dayOffList" element={<DayOffList/>} />
            <Route path="preferences" element={<Preferences/>} />
          </Route>
          <Route path="calendar" element={<CalendarLayout/>}>
            <Route path="myCalendar" element={<MyCalendar/>} />
            <Route path="taskMain" element={<TaskMain/>} />
            {/* 내용추가 */}
          </Route>
          <Route path="employee" element={<EmployeeLayout/>}>
            <Route path="organization" element={<Organization />} />
            <Route path="personalList" element={<PersonalList />} />
            <Route path="personalRegist" element={<PersonalRegist />} />
            <Route path="personalView/:erdNum" element={<PersonalView />} />
            <Route path='employeeList' element={<EmployeeList />} />
            <Route path='appointList' element={<AppointList />} />
            <Route path='appointRegist' element={<AppointRegist />} />
            <Route path='appointView/:aappNo' element={<AppointView />} />
            <Route path='deptManagerMent' element={<DeptManagerMent />} />
          </Route> 
          <Route path='myInfo' element={<MyInfoLayout />} >
            <Route path="myInfo" element={<MyInfo />} />  
            <Route path="myPersonalRecordCard" element={<MyPersonalRecordCard />} />  
          </Route>
          <Route path="message" element={<MessageLayout/>}>
            <Route index element={<Navigate to="storage/receive" replace/>}/>
            <Route path='storage'>
              <Route path='deliver' element={<CreateMsg/>}/>
              <Route path='receive' element={<ReceiveMsg/>}/>
              <Route path='receive/detail/:msgCode' element={<RevDetail/>}/>
              <Route path='send' element={<SendMsg/>}/>
              <Route path='send/detail/:msgCode' element={<SendDetail/>}/>
              <Route path='temp' element={<TempMsg/>}/>
              <Route path='create/temp/:msgCode' element={<TempDetail/>}/>
              <Route path='important' element={<ImpMsg/>}/>
              <Route path='imp/detail/:msgCode' element={<ImpDetail/>}/>
              <Route path='work' element={<WorkMsg/>}/>
              <Route path='work/detail/:msgCode' element={<WorkDetail/>}/>
              <Route path='bin' element={<Bin/>}/>
              <Route path='bin/detail/:msgCode' element={<BinDetail/>}/>
              <Route path='setting' element={<SettingStor/>}/>
              <Route path='block' element={<BlockEmp/>}/>
            </Route>
          </Route>
          <Route path="post" element={<PostLayout/>}>
          <Route path="PostListView" element={<PostListView/>} />
          <Route path='PostListViewInBoard/:lowBoardCode' element={<PostListViewInBoard/>}/>
          <Route path='PostDetail/:postCode'element={<PostDetailView/>}/>
          <Route path="PostCreateView" element={<PostCreateView/>} />
          <Route path='BoradCreateView' element={<BoradCreateView/>}/>
          <Route path='PostEditView/:postCode' element={<PostEditView/>}/>
          <Route path='PostReadyList/:empcode' element={<PostReadyList/>}/>
          <Route path='BoradCreateView' element={<BoradCreateView/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

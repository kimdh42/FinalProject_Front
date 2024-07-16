import { handleActions, createActions } from "redux-actions";
import PostReadyList from "../PostReadyList";

const initialState = {
  Postdata: [],
  BoardState: [], // 게시판 데이터
  LowBoardState: [], // 소분류 게시판 데이터
  SortListState:[],
  PostdataInBoard:[], //특정 게시판의 글
  PostdataInBoardPin:[], //특정 게시판의 고정글
  DetailState:[],
  FileState:[],
  CommentState:[],
  AllLowState:[],
  PostSearch:[],
  PostEditState:[],
  PostReadyState:[],
  RollState:[],
  PostRoleState:[],
  LowCodeList:[]
};

const GET_POSTLIST = 'post/GET_POSTLIST';
const GET_ALLBOARD = 'post/GET_ALLBOARD';
const GET_ALLLOWBOARD = 'post/GET_ALLLOWBOARD';
const GET_SORTLIST='post/GET_SORTLIST';
const GET_POSTDATAINBOARD='post/GET_POSTDATAINBOARD';
const GET_POSTDATAINBOARDPIN='post/GET_POSTDATAINBOARDPIN';
const GET_DETAIL='post/GET_DETAIL'
const GET_FILE='post/GET_FILE'
const GET_COMMENT='post/GET_COMMENT'
const GET_ALLLOW='post/GET_ALLLOW'
const GET_POSTSEARCH='post/GET_POSTSEARCH'
const GET_POSTEDIT='post/GET_POSTEDIT'
const GET_POSTREADY='post/GET_POSTREADY'
const GET_ROLL='post/GET_ROLL'
const GET_POSTROLE='post/GET_POSTROLE'
const GET_LOWDATATOCODE='post/GET_LOWDATATOCODE'
// 액션 생성자 함수 생성
export const { post: {getLowdatatocode,getPostrole,getRoll,getPostready,getPostedit,getPostsearch,getAlllow,getComment,getFile,getPostlist, getAllboard, getAlllowboard,getSortlist,getPostdatainboard,getPostdatainboardpin,getDetail } } = createActions({
  [GET_POSTLIST]: postlist => ({ postlist }),
  [GET_ALLBOARD]: boardlist => ({ boardlist }),
  [GET_ALLLOWBOARD]: lowboardlist => ({ lowboardlist }),
  [GET_SORTLIST]:sortlist=>({sortlist}),
  [GET_POSTDATAINBOARD]: postdatainboardlist=>({postdatainboardlist}),
  [GET_POSTDATAINBOARDPIN]: postdatainboardpin=>({postdatainboardpin}),
  [GET_DETAIL]:detaildata=>({detaildata}),
  [GET_FILE]:filelist=>({filelist}),
  [GET_COMMENT]:commentlist=>({commentlist}),
  [GET_ALLLOW]:alllowlist=>({alllowlist}),
  [GET_POSTSEARCH]:postsearchlist=>({postsearchlist}),
  [GET_POSTEDIT]:posteditdata=>({posteditdata}),
  [GET_POSTREADY]:postreadydata=>({postreadydata}),
  [GET_ROLL]:rolldata=>({rolldata}),
  [GET_POSTROLE]:postrole=>({postrole}),
  [GET_LOWDATATOCODE]:lowcodelist=>({lowcodelist})
});

// 확인용 로그 : 이다정 주석처리
// console.log("getPostlist", getPostlist);
// console.log("getAllBoard", getAllboard);
// console.log("getAllLowBoard", getAlllowboard);
// console.log("getSortlist",getSortlist);
// console.log("getAlllow",getAlllow);
console.log("getReadypost",getPostready)
console.log("getRoll",getRoll)
console.log("getPostrole",getPostrole)

// 초기 상태 및 리듀서 정의
const postReducer = handleActions(
  {
    [GET_POSTLIST]: (state, { payload }) => ({
      ...state,
      Postdata: payload.postlist
    }),
    [GET_ALLBOARD]: (state, { payload }) => ({
      ...state,
      BoardState: payload.boardlist
    }),
    [GET_ALLLOWBOARD]: (state, { payload }) => ({
      ...state,
      LowBoardState: payload.lowboardlist
    }),
    [GET_SORTLIST]:(state,{payload})=>({
      ...state,
      SortListState:payload.sortlist
    }),
    [GET_POSTDATAINBOARD]:(state,{payload})=>({
      ...state,
      PostdataInBoard:payload.postdatainboardlist
    }),
    [GET_POSTDATAINBOARDPIN]: (state, { payload }) => ({
      ...state,
      PostdataInBoardPin: payload.postdatainboardpin
    }),
    [GET_DETAIL]:(state,{payload})=>({
      ...state,
      DetailState:payload.detaildata
    }),
    [GET_FILE]:(state,{payload})=>({
      ...state,
      FileState:payload.filelist
    }),
    [GET_COMMENT]:(state,{payload})=>({
      ...state,
      CommentState:payload.commentlist
    }),
    [GET_ALLLOW]:(state,{payload})=>({
      ...state,
      AllLowState:payload.alllowlist
    }),
    [GET_POSTSEARCH]:(state,{payload})=>({
      ...state,
      PostSearch:payload.postsearchlist
    }),
    [GET_POSTEDIT]:(state,{payload})=>({
      ...state,
      PostEditState:payload.posteditdata
    }),
    [GET_POSTREADY]:(state,{payload})=>({
      ...state,
      PostReadyState:payload.postreadydata
    }),
    [GET_ROLL]:(state,{payload})=>({
      ...state,
      RollState:payload.rolldata
    }),
    [GET_POSTROLE]:(state,{payload})=>({
      ...state,
      PostRoleState:payload.postrole
    }),
    [GET_LOWDATATOCODE]:(state,{payload})=>({
      ...state,
      LowCodeList:payload.lowcodelist
    })

  },
  initialState
);

// 콘솔 로그를 통해 상태 및 리듀서 확인 : 이다정 주석처리
// console.log("postReducer", postReducer);
// console.log("initialState.Postdata", initialState.Postdata);
// console.log("initialState.BoardState", initialState.BoardState);
// console.log("initialState.LowBoardState", initialState.LowBoardState);
// console.log("initialState.SoftListState",initialState.SortListState);
// console.log("initialState.PostdataInBoard",initialState.PostdataInBoard);
// console.log("initialState.PostdataInBoardPin",initialState.PostdataInBoardPin);
// console.log("initialState.AllLowState",initialState.AllLowState);
console.log("initialState.PostReadyState",initialState.PostReadyState);
console.log("initialState.RollState",initialState.RollState);
console.log("initialState.PostRoleState",initialState.PostRoleState);



export default postReducer;

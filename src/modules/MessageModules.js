import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {
    messages: [],
    revMessage: [],
    sendMessage: [],
    impMessage: [],
    workMessage: [],
    binMessage: [],
    messageDetail: null,
    attachments : []
};

/* 액션 타입 */
const GET_REV_MSG = 'message/GET_REV_MSG';
const GET_SEND_MSG = 'message/GET_SEND_MSG';
const GET_BIN_MSG = 'message/GET_BIN_MSG';
const GET_IMP_MSG = 'message/GET_IMP_MSG';
const GET_WORK_MSG = 'message/GET_WORK_MSG';
const GET_TEMP_MSG = 'message/GET_TEMP_MSG';
const DEL_MSG = 'message/DEL_MSG';
const DEL_SEND_MSG = 'message/DEL_SEND_MSG';
const UP_MSG_STATUS = 'message/UP_MSG_STATUS';
const UP_MSG_STATUS_NR = 'message/UP_MSG_STATUS_NR';
const MOV_MSG_IMP = 'message/MOV_MSG_IMP';
const MOV_MSG_WORK = 'message/MOV_MSG_WORK';
const MOV_MSG_REV = 'message/MOV_MSG_REV';

const GET_REV_DETAIL = 'message/GET_REV_DETAIL';
const GET_SEND_DETAIL = 'message/GET_SEND_DETAIL';
const GET_ATTACH_LIST = 'message/GET_ATTACH_LIST';

const UP_REV_MSG_STATUS = 'message/UP_REV_MSG_STATUS';
const UP_ALL_REV_STATUS = 'message/UP_ALL_REV_STATUS';
const UP_ALL_IMP_STATUS = 'message/UP_ALL_IMP_STATUS';
const UP_ALL_WORK_STATUS = 'message/UP_ALL_WORK_STATUS';
const UP_ALL_SEND_STATUS = 'message/UP_ALL_SEND_STATUS';

export const { message : { getRevMsg, getSendMsg, getBinMsg, getImpMsg, getWorkMsg, delMsg, getRevDetail, getSendDetail 
    , getTempMsg, delSendMsg, upMsgStatus, getAttachList, movMsgImp, movMsgWork, movMsgRev, upRevMsgStatus, upMsgStatusNr,
    upAllRevStatus, upAllImpStatus, upAllWorkStatus, upAllSendStatus
}} = createActions({
    [GET_REV_MSG] : result => {return {message: result};},
    [GET_SEND_MSG] : result => {return {message: result};},
    [GET_BIN_MSG] : result => {return {message: result};},
    [GET_IMP_MSG] : result => {return {message: result};},
    [GET_WORK_MSG] : result => {return {message: result};},
    [GET_TEMP_MSG] : result => {return {message: result};},
    [DEL_MSG] : msgCode => {return { msgCode };},
    [GET_REV_DETAIL] : result => {return {messageDetail: result};},
    [GET_SEND_DETAIL] : result => {return {messageDetail: result};},
    [DEL_SEND_MSG] : msgCode => {return { msgCode };},
    [UP_MSG_STATUS] : msgCode => {return { msgCode };},
    [GET_ATTACH_LIST] : msgCode => {return { msgCode };},
    [MOV_MSG_IMP] : msgCode => {return { msgCode };},
    [MOV_MSG_WORK] : msgCode => {return { msgCode };},
    [MOV_MSG_REV] : msgCode => {return { msgCode };},
    [UP_REV_MSG_STATUS] : msgCodes => {return { msgCodes };},
    [UP_MSG_STATUS_NR] : msgCode => {return { msgCode };},
    [UP_ALL_REV_STATUS] : msgCodes => {return { msgCodes };},
    [UP_ALL_IMP_STATUS] : msgCodes => {return { msgCodes };},
    [UP_ALL_WORK_STATUS] : msgCodes => {return { msgCodes };},
    [UP_ALL_SEND_STATUS] : msgCodes => {return { msgCodes };}

}, initialState);


/* 리듀서 */
const messageReducer = handleActions({
    [GET_REV_MSG] : (state, {payload}) => {return {...state, revMessage: payload};},
    [GET_SEND_MSG] : (state, {payload}) => {return {...state, sendMessage: payload};},
    [GET_BIN_MSG] : (state, {payload}) => {return {...state, binMessage: payload}},
    [GET_IMP_MSG] : (state, {payload}) => {return {...state, impMessage: payload}},
    [GET_WORK_MSG] : (state, {payload}) => {return {...state, workMessage: payload}},
    [GET_TEMP_MSG] : (state, {payload}) => {return {...state, messages: payload}},

    [DEL_MSG] : (state, {payload}) => {
        return {
            ...state,
            messages: state.messages.map(msg =>
                msg.msgCode === payload.msgCode ? { ...msg, storCode: 5 } : msg
            )
        }
    },

    [GET_REV_DETAIL] : (state, {payload}) => ({...state, messageDetail: payload}),
    [GET_SEND_DETAIL] : (state, {payload}) => ({...state, messageDetail: payload}),

    [DEL_SEND_MSG] : (state, {payload}) => {
        return {
            ...state,
            messages: state.messages.map(msg =>
                msg.msgCode === payload.msgCode ? { ...msg, storCode: 5 } : msg
            )
        }
    },

    [UP_MSG_STATUS] : (state, {payload}) => {
        const updatedMsg = state.messages.map(msg =>
            msg.msgCode === payload.msgCode ? { ...msg, msgStatus: 'Y'} : msg
        );

        return {
            ...state,
            messages: updatedMsg
        };
    },

    [GET_ATTACH_LIST] : (state, {payload}) => {return {...state, attachments: payload}},

    [MOV_MSG_IMP] : (state, {payload}) => {
        return {
            ...state,
            messages: state.messages.map(msg =>
                msg.msgCode === payload.msgCode ? { ...msg, storCode: 2 } : msg
            )
        }
    },

    [MOV_MSG_WORK] : (state, { payload }) => {
        return {
            ...state,
            messages: state.messages.map(msg =>
                msg.msgCode === payload.msgCode ? { ...msg, storCode: 3 } : msg
            )
        }
    },

    [MOV_MSG_REV] : (state, { payload }) => {
        return {
            ...state,
            messages: state.messages.map(msg => 
                msg.msgCode === payload.msgCode ? { ...msg, storCode: 1 } : msg
            )
        }
    },

    [UP_REV_MSG_STATUS] : (state, { payload }) => {
        const updateRevMsgs = state.revMessage.map(msg =>
            payload.msgcodes.includes(msg.msgCode) ? { ...msg, msgStatus: 'Y' } : msg
        );

        return {
            ...state,
            revMessage: updateRevMsgs
        }
    },

    [UP_MSG_STATUS_NR] : (state, {payload}) => {
        const updateMsgNr = state.messages.map(msg => 
            msg.msgCode === payload.msgCode ? { ...msg, msgStatus: 'N' } : msg
        );

        return {
            ...state,
            messages: updateMsgNr
        };
    },

    [UP_ALL_REV_STATUS] : (state, { payload }) => {
        const updateAllRevStor = state.revMessage.map(msg =>
            payload.msgCodes.includes(msg.msgCode) ? { ...msg, revStor: '5'} : msg
        );

        return {
            ...state,
            revMessage: updateAllRevStor
        }
    },

    [UP_ALL_IMP_STATUS] : (state, { payload }) => {
        const updateAllImpStor = state.impMessage.map(msg =>
            payload.msgCodes.includes(msg.msgCode) ? { ...msg, revStor: '5'} : msg
        );

        return {
            ...state,
            impMessage: updateAllImpStor
        }
    },

    [UP_ALL_WORK_STATUS] : (state, { payload }) => {
        const updateAllWorkStor = state.workMessage.map(msg =>
            payload.msgCodes.includes(msg.msgCode) ? { ...msg, revStor: '5'} : msg
        );

        return {
            ...state,
            workMessage: updateAllWorkStor
        }
    },

    [UP_ALL_SEND_STATUS] : (state, { payload }) => {
        const updateAllSendStor = state.sendMessage.map(msg =>
            payload.msgCodes.includes(msg.msgCode) ? { ...msg, revStor: '5'} : msg
        );

        return {
            ...state,
            sendMessage: updateAllSendStor
        }
    }

}, initialState);

export default messageReducer;
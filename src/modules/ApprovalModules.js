import { createActions, handleActions } from "redux-actions";

const initialState = {
    formdetail: {},
    forms: [],
    lines: [],
    lineemps: [],
    success: null,
    content: null,
    onedoc: {},
    documents: [],
    viewlines: [],
    boxes: [],
    attaches: [],
};

const GET_FORMDETAIL = 'approval/GET_FORMDETAIL';
const GET_FORMS = 'approval/GET_FORMS';
const GET_LINES = 'approval/GET_LINES';
const GET_LINEEMPS = 'approval/GET_LINEEMPS';
const GET_SUCCESS = 'approval/GET_SUCCESS';
const RESET_SUCCESS = 'approval/RESET_SUCCESS';
const GET_CONTENT = 'approval/GET_CONTENT';
const RESET_CONTENT = 'approval/RESET_CONTENT';
const GET_DOCUMENTS = 'approval/GET_DOCUMENTS';
const GET_VIEWLINES = 'approval/GET_VIEWLINES';
const RESET_VIEWLINES = 'approval/RESET_VIEWLINES';
const GET_BOXES = 'approval/GET_BOXES';
const GET_ATTACHES = 'approval/GET_ATTACHES';
const RESET_ATTACHES = 'approval/RESET_ATTACHES';
const GET_ONEDOC = 'approval/GET_ONEDOC';
const RESET_ONEDOC = 'approval/RESET_ONEDOC';

export const {approval: {getFormdetail, getForms, getLines, getLineemps, getSuccess, resetSuccess, getContent, getDocuments, getViewlines, resetViewlines, resetContent, getBoxes, getAttaches, resetAttaches, getOnedoc, resetOnedoc}} = createActions({
    [GET_FORMDETAIL]: result => ({ formdetail: result.data }),
    [GET_FORMS]: result => ({ forms: result.data }),
    [GET_LINES]: result => ({ lines: result.data }),
    [GET_LINEEMPS]: result => ({ lineemps: result.data }),
    [GET_SUCCESS]: result => ({ success: result }),
    [RESET_SUCCESS]: () => ({success: null}),
    [GET_CONTENT]: result => ({content: result.data}),
    [RESET_CONTENT]: () => ({content: null}),
    [GET_DOCUMENTS]: result => ({documents: result.data}),
    [GET_VIEWLINES]: result => ({viewlines: result.data}),
    [RESET_VIEWLINES]: () => ({viewlines: null}),
    [GET_BOXES]: result => ({boxes: result.data}),
    [GET_ATTACHES]: result => ({attaches: result.data}),
    [RESET_ATTACHES]: () => ({attaches: null}),
    [GET_ONEDOC]: result => ({onedoc: result.data}),
    [RESET_ONEDOC]: () => ({onedoc: null}),
});

const approvalReducer = handleActions({
    [GET_FORMDETAIL]: (state, { payload }) => ({...state, formdetail: payload.formdetail}),
    [GET_FORMS]: (state, { payload }) => ({...state, forms: payload.forms}),
    [GET_LINES]: (state, { payload }) => ({...state, lines: payload.lines}),
    [GET_LINEEMPS]: (state, { payload }) => ({...state, lineemps: payload.lineemps}),
    [GET_SUCCESS]: (state, { payload }) => ({...state, success: payload.success}),
    [RESET_SUCCESS]: (state, action) => ({...state, success: null}),
    [GET_CONTENT]: (state, {payload}) => ({...state, content: payload.content}),
    [RESET_CONTENT]: (state, action) => ({...state, content: null}),
    [GET_DOCUMENTS]: (state, {payload}) => ({...state, documents: payload.documents}),
    [GET_VIEWLINES]: (state, {payload}) => ({...state, viewlines: payload.viewlines}),
    [RESET_VIEWLINES]: (state, action) => ({...state, viewlines: null}),
    [GET_BOXES]: (state, {payload}) => ({...state, boxes: payload.boxes}),
    [GET_ATTACHES]: (state, {payload}) => ({...state, attaches: payload.attaches}),
    [RESET_ATTACHES]: (state, action) => ({...state, attaches: null}),
    [GET_ONEDOC]: (state, {payload}) => ({...state, onedoc: payload.onedoc}),
    [RESET_ONEDOC]: (state, action) => ({...state, onedoc: null}),
}, initialState);

export default approvalReducer;

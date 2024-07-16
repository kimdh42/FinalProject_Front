import { createActions, handleActions } from "redux-actions";

/* 초기값 */
const initialState = {};

/* 액션 타입 */
const SUCCESS = 'login/SUCCESS';
const RESET = 'login/RESET';

/* 액션 함수 */
export const { login : { success, reset}} = createActions({
    [SUCCESS] : () => ({ success : true}),
    [RESET] : () => {}
});


/* 리듀서 함수 */
const loginReducer = handleActions({
    [SUCCESS] : (state, { payload }) => payload,
    [RESET] : () => initialState
}, initialState);

export default loginReducer;
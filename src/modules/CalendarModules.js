import { createActions, handleActions } from "redux-actions";

const initialState = {
    events:[]
};

const GET_EVENTS = 'calendar/GET_EVENTS';

export const {calendar: {getEvents}} = createActions({
    [GET_EVENTS]: result => ({ events: result.data })
});

const calendarReducer = handleActions({
    [GET_EVENTS]: (state, { payload }) => {
        console.log('리듀서 payload:', payload);
        return { ...state, events: payload.events };
    }
}, initialState);


export default calendarReducer;
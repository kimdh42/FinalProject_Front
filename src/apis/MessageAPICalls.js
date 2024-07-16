import { delMsg, delSendMsg, getAttachList, getBinMsg, getImpMsg, getRevDetail, getRevMsg, getSendMsg, getTempMsg, getWorkMsg, movMsgImp, movMsgRev, movMsgWork, upAllImpStatus, upAllRevStatus, upAllSendStatus, upAllWorkStatus, upMsgStatus, upMsgStatusNr, upRevMsgStatus } from "../modules/MessageModules";
import { request } from "./api";

/* 받은 쪽지 전체 조회 API */
export const callRevMsgListAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/emp/message/receive', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });
            
            if (result && result.status === 200) {

                dispatch(getRevMsg(result.data));
            } else {
                console.log('error : ', result);
            }
        } catch (error) {
            console.log("error : ", error);
        }
    };
};

/* 보낸 쪽지 전체 조회 API */
export const callSendMsgListAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/emp/message/send', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            if (result && result.status === 200) {
                dispatch(getSendMsg(result.data));
            } else {
                console.log('error : ', result);
            }
        } catch (error) {
            console.log('error : ', error);
        }
    };
};

/* 휴지통 쪽지 전체 조회 API */
export const callBinMsgListAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/emp/message/bin', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });
            
            if (result && result.status === 200) {
                dispatch(getBinMsg(result.data));
            } else {
                console.log("error : ", result);
            } 
        } catch (error) {
            console.log('error : ', error);
        }
    };
};

/* 중요 보관함 전체 조회 API */
export const callImpMsgListAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/emp/message/important', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            if (result && result.status === 200) {
                dispatch(getImpMsg(result.data));
            } else {
                console.log("error : ", result);
            }  
        } catch (error) {
            console.log("error :", error);
        }
    };
};

/* 업무 보관함 전체 조회 API */
export const callWorkMsgListAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/emp/message/work', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            if (result && result.status === 200) {
                dispatch(getWorkMsg(result.data));
            } else {
                console.log("error : " ,result);
            }
        } catch (error) {
            console.log("error : ", error);
        }
    };
};

/* 임시 보관함 전체 조회 API */
export const callTempMsgListAPI = () => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', '/emp/message/temp', {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            console.log("API 작동 시작")
            if (result && result.status === 200) {
                dispatch(getTempMsg(result.data));
            } else {
                console.log("error : " ,result);
            }
        } catch (error) {
            console.log("error : ", error);
        }
    };
}

/* 받은 쪽지 휴지통 이동 API */
export const callDelMsgAPI = (msgCode) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('PUT', `/emp/message/receive/${msgCode}/bin`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, {
                storCode: 5
            });

            if (result && result.status === 200) {
                dispatch(delMsg(msgCode));
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("del error : ", error);
        }
    };
};

/* 받은 쪽지 전체 휴지통 이동 API */
export const callDelAllMsgAPI = (msgCodes) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('PUT', `/emp/message/receive/updateRevStor`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, msgCodes);

            if (result && result.status === 200) {
                msgCodes.forEach(msgCode => {
                    dispatch(upAllRevStatus(msgCode));  // 각 msgCode에 대해 삭제 액션을 디스패치
                });
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("del error : ", error);
        }
    };
};

/* 중요 보관함 전체 휴지통 이동 API */
export const callDelAllImpMsgAPI = (msgCodes) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('PUT', `/emp/message/receive/updateRevStor`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, msgCodes);

            if (result && result.status === 200) {
                msgCodes.forEach(msgCode => {
                    dispatch(upAllImpStatus(msgCode));  // 각 msgCode에 대해 삭제 액션을 디스패치
                });
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("del error : ", error);
        }
    };
};

/* 업무 보관함 전체 휴지통 이동 API */
export const callDelAllWorkMsgAPI = (msgCodes) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('PUT', `/emp/message/receive/updateRevStor`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, msgCodes);

            if (result && result.status === 200) {
                msgCodes.forEach(msgCode => {
                    dispatch(upAllWorkStatus(msgCode));  // 각 msgCode에 대해 삭제 액션을 디스패치
                });
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("del error : ", error);
        }
    };
};

/* 보낸 쪽지 전체 휴지통 이동 API */
export const callDelAllSendMsgAPI = (msgCodes) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('PUT', `/emp/message/send/updateSendStor`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, msgCodes);

            if (result && result.status === 200) {
                msgCodes.forEach(msgCode => {
                    dispatch(upAllSendStatus(msgCode));  // 각 msgCode에 대해 삭제 액션을 디스패치
                });
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("del error : ", error);
        }
    };
};

/* 보낸 쪽지 휴지통 이동 API */
export const callDelSendMsgAPI = (msgCode) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('PUT', `/emp/message/send/${msgCode}/bin`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, {
                storCode: 5
            });

            if (result && result.status === 200) {
                dispatch(delSendMsg(msgCode));
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("del error : ", error);
        }
    };
};

/* 받은 쪽지 디테일 API */
export const callRevDetailAPI = (msgCode) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', `/emp/message/receive/${msgCode}`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            if (result && result.status === 200) {
                dispatch(getRevDetail(result.data));
            } else {
                console.log("error : " ,result);
            }
        } catch(error) {
            console.log("error :: ", error);
        }
    };
};

/* 보낸 쪽지 디테일 API */
export const callSendDetailAPI = (msgCode) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', `/emp/message/send/${msgCode}`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            if (result && result.status === 200) {
                dispatch(getRevDetail(result.data));
            } else {
                console.log("error : " ,result);
            }
        } catch (error) {
            console.log("error :: ", error);
        }
    };
};

/* 읽음 처리 API */
export const callUpdateMsgStautsAPI = (msgCode) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('PATCH', `/emp/message/${msgCode}/read`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            if (result && result.status === 200) {
                dispatch(upMsgStatus(result.data));
            } else {
                console.log('error : ', result);
            }
        } catch (error) {
            console.log("error :: ", error);
        }
    };
};

/* 파일 조회 API */
export const callGetAttachListAPI = (msgCode) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('GET', `/emp/message/findAttach/${msgCode}`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            });

            if (result && result.status === 200) {
                dispatch(getAttachList(result.data));
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("error :: ", error);
        }
    };
};

/* 임시저장 파일 조회 API */
export const callGetAttachmentListAPI = async (msgCode) => {
    try {
        const response = await fetch(`http://localhost:8080/emp/message/findAttach/${msgCode}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        return data; // API에서 반환하는 데이터를 그대로 반환
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // 오류 처리를 위해 예외 처리
    }    
};

/* 중요 보관함 이동 API */
export const callMoveToImpAPI = (msgCode) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('PUT', `/emp/message/toImp/${msgCode}`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, {
                storCode: 2
            });

            if (result && result.status === 200) {
                dispatch(movMsgImp(msgCode));
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("movToImp error : ", error);
        }
    };
};

/* 업무 보관함 이동 API */
export const callMoveToWorkAPI = (msgCode) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('PUT', `/emp/message/toImp/${msgCode}`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, {
                storCode: 3
            });

            if (result && result.status === 200) {
                dispatch(movMsgWork(msgCode));
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("movToImp error : ", error);
        }
    };
};

/* 받은 쪽지 이동 API */
export const callMoveToRevAPI = (msgCode) => {
    return async (dispatch, getState) => {
        try {
            const result = await request('PUT', `/emp/message/toImp/${msgCode}`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, {
                storCode: 1
            });
            
            if (result && result.status === 200) {
                dispatch(movMsgRev(msgCode));
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log("movToImp error : ", error);
        }
    };
};

/* 모든 받은 쪽지 읽음 처리 API */
export const callUpdateAllRevMsgAPI = (msgCodes) => {
    return async (dispatch, getState) => {
        try {
            const result = await request("PUT", `/emp/message/receive/updateStatus`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'
            }, msgCodes);
            if(result && result.status === 200) {
                dispatch(upRevMsgStatus(msgCodes));
            } else {
                console.log('error : ', result);
            }
        } catch (error) {
            console.log("error :: ", error);
        }
    };
};

/* 읽지 않음 처리 API */
export const callUpdateMsgStatusNrAPI = (msgCode) => {
    return async (dispatch, getState) => {
        try {
            const result = await request("PATCH", `/emp/message/${msgCode}/unread`, {
                'Authorization': `Bearer ${localStorage.getItem('access-token')}`,
                'Content-Type': 'application/json'                
            });
            if(result && result.status === 204) {
                dispatch(upMsgStatusNr(result.data));
            } else {
                console.log("error : ", result);
            }
        } catch (error) {
            console.log('error : : ', error);
        }
    };
};
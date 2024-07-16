import {
    getAttaches,
    getBoxes,
    getContent,
    getDocuments, getFormdetail,
    getForms,
    getLineemps,
    getLines, getOnedoc,
    getSuccess,
    getViewlines
} from "../modules/ApprovalModules";
import { request } from "./api";

export const callFormListAPI = () => {              // 결재양식리스트 조회
    return async (dispatch, getState) => {
        const result = await request('GET', '/approval/formList');
        if(result && result.status === 200) dispatch(getForms(result));
    }
}

export const callFormContentAPI = (afCode) => {     // 결재양식기본내용 조회
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/formContent?afCode=${afCode}`);
        if(result && result.status === 200) dispatch(getFormdetail(result));
    }
}

export const callFormLineAPI = ({lsCode = null}) => {      // 결재라인 특정 조회
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/formLine?lsCode=${lsCode}`);
        if(result && result.status === 200) dispatch(getLines(result));
    }
}

export const callAllLineAPI = () => {      // 모든 결재라인 조회
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/allLine`);
        if(result && result.status === 200) dispatch(getLines(result));
    }
}

export const callLineEmpListAPI = ({deptCode, titleCode, lsCode}) => {      // 결재라인 회원 조회(본인 기준)
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/formLineEmp?deptCode=${deptCode}&titleCode=${titleCode}&lsCode=${lsCode}`);
        if(result && result.status === 200) dispatch(getLineemps(result));
    }
}

export const fetchImage = async (empCode) => {      // 결재서명 이미지 조회(본인 기준)
    try {
        const response = await fetch(`http://localhost:8080/approval/sign?empCode=${empCode}`);
        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            return imageUrl;
        } else {
            console.error('Failed to fetch image');
            return null;
        }
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
};

export const callApprovalDocRegistAPI = ({formData, temporary}) => {        // 결재 등록
    return async (dispatch, getState) => {
        try {
            console.log("formData", formData);

            const response = await request('POST', `/approval/regist?temporary=${temporary}`,
                {"Content-Type": "multipart/form-data"},
                formData
            );

            if (response && response.status === 201) {
                dispatch(temporary ? getSuccess("임시저장") : getSuccess("상신"));
            };

        } catch (error) {
            console.error("Document and file upload error:", error);
        }
    }
}

export const callsendDocListAPI = ({currentPage = 1, empCode, status}) => {
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/send/document?page=${currentPage}&empCode=${empCode}&status=${status}`);
        if(result && result.status === 200) {
            const documentsWithMenu = result.data.map(doc => ({ ...doc, menu: 'send' }));
            dispatch(getDocuments({ data: documentsWithMenu }));
        }
    }
}

export const callviewInfoAPI = (adCode) => {
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/viewInfo?adCode=${adCode}`);
        if(result && result.status === 200) dispatch(getOnedoc(result));
    }
}

export const callviewLineListAPI = (adCode) => {
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/viewLine?adCode=${adCode}`);
        if(result && result.status === 200) dispatch(getViewlines(result));
    }
}

export const callviewDetailAPI = (adDetail) => {
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/viewDetail?adDetail=${adDetail}`);
        if(result && result.status === 200) dispatch(getContent(result));
    }
}

export const callviewAttachAPI = (adCode) => {
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/viewAttach?adCode=${adCode}`);
        if(result && result.status === 200) dispatch(getAttaches(result));
    }
}

export const calldownloadAttachAPI = (attachOriginal, attachSave) => {
    const encodedAttachOriginal = encodeURIComponent(attachOriginal);
    const encodedAttachSave = encodeURIComponent(attachSave);

    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/downloadAttach?attachOriginal=${encodedAttachOriginal}&attachSave=${encodedAttachSave}`, null, null, 'blob');

        if (result) {
            const url = window.URL.createObjectURL(new Blob([result.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', attachOriginal); // set the file name
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    }
}

export const calldeleteDocumentAPI = (adCode) => {
    return async (dispatch, getState) => {
        await request('DELETE', `/approval/document/delete?adCode=${adCode}`);
    }
}

export const callmodifyStatusAPI = (adCode) => {
    return async (dispatch, getState) => {
        await request ('PATCH', `/approval/modifyStatus?adCode=${adCode}`);
    }
}
export const uploadImage = async (empCode, formData) => {
    try {
        const response = await request('PATCH', `/approval/uploadImage?empCode=${empCode}`,
                {'Content-Type': 'multipart/form-data'},
                formData
            );
        return response.data; // 업로드된 이미지의 URL 반환
    } catch (error) {
        console.error('이미지 업로드 실패:', error);
        throw error; // 실패한 경우 예외 처리
    }
};

export const callreceiveDocListAPI = ({empCode, status}) => {
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/receive/document?empCode=${empCode}&status=${status}`);
        // if(result && result.status === 200) dispatch(getDocuments(result));
        if(result && result.status === 200) {
            const documentsWithMenu = result.data.map(doc => ({ ...doc, menu: 'receive' }));
            dispatch(getDocuments({ data: documentsWithMenu }));
        }
    }
}

export const callacceptDocumentAPI = ({empCode, status, adCode}) => {
    return async (dispatch, getState) => {
        await request ('PATCH', `/approval/accept?empCode=${empCode}&status=${status}&adCode=${adCode}`);
    }
}

export const callreturnDocumentAPI = ({empCode, adCode, talReason}) => {
    return async (dispatch, getState) => {
        try {
            const response = await request('PATCH', `/approval/return?empCode=${empCode}&adCode=${adCode}`, 
                {'Content-Type': 'application/json'},
                talReason,
            );
        } catch (error) {
            console.error('요청 실패:', error);
            throw error; // 실패한 경우 예외 처리
        }
    }
}

export const callregistFormAPI = (newForm) => {
    return async (dispatch, getState) => {
        try {
            const response = await request('POST', `/approval/registForm`,
                {'Content-Type': 'application/json'},
                newForm,
            );
        } catch (error) {
            console.error('요청 실패:', error);
            throw error; // 실패한 경우 예외 처리
        }
    }
}

export const calldeleteFormAPI = (afCode) => {
    return async (dispatch, getState) => {
        await request('DELETE', `/approval/deleteForm?afCode=${afCode}`);
    }
}

export const callmodifyFormAPI = ({afCode, newForm}) => {
    return async (dispatch, getState) => {
        try {
            const response = await request('POST', `/approval/modifyForm?afCode=${afCode}`,
                {'Content-Type': 'application/json'},
                newForm,
            );
        } catch (error) {
            console.error('요청 실패:', error);
            throw error; // 실패한 경우 예외 처리
        }
    }
}

export const callnonActiveFormAPI = (afCode) => {
    return async (dispatch, getState) => {
        await request('PATCH', `/approval/nonActiveForm?afCode=${afCode}`);
    }
}

export const callactiveFormAPI = (afCode) => {
    return async (dispatch, getState) => {
        await request('PATCH', `/approval/activeForm?afCode=${afCode}`);
    }
}

export const callcheckIsFormAPI = (afCode) => {
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/checkIsForm?afCode=${afCode}`);
        return result.data;
    }
}

export const callregistBoxAPI = (newBox) => {
    return async (dispatch, getState) => {
        try {
            const response = await request('POST', `/approval/registBox`,
                {'Content-Type': 'application/json'},
                newBox,
            );
        } catch (error) {
            console.error('요청 실패:', error);
            throw error; // 실패한 경우 예외 처리
        }
    }
}

export const callboxListAPI = (empCode) => {
    return async (dispatch, getState) => {
        // console.log("empCode", empCode);
        const result = await request('GET', `/approval/boxList?empCode=${empCode}`);
        if(result && result.status === 200) dispatch(getBoxes(result));
    }
}

export const calldeleteBoxAPI = (abCode) => {
    return async (dispatch, getState) => {
        await request('DELETE', `/approval/deleteBox?abCode=${abCode}`);
    }
}

export const callmodifyBoxAPI = ({abCode, modifyname}) => {
    return async (dispatch, getState) => {
        try {
            const response = await request('PATCH', `/approval/modifybox?abCode=${abCode}`,
                {'Content-Type': 'application/json'},
                modifyname,
            );
        } catch (error) {
            console.error('요청 실패:', error);
            throw error; // 실패한 경우 예외 처리
        }
    }
}

export const calldocListInStorageAPI = (abCode) => {
    return async (dispatch, getState) => {
        const result = await request('GET', `/approval/docListInStorage?abCode=${abCode}`);
        if(result && result.status === 200) dispatch(getDocuments(result));
    }
}

export const callregistDocInStorageAPI = ({adCode, abCode}) => {
    return async (dispatch, getState) => {
        try {
            const response = await request('POST', `/approval/registDocInStorage?adCode=${adCode}&abCode=${abCode}`);
        } catch (error) {
            console.error('요청 실패:', error);
            throw error; // 실패한 경우 예외 처리
        }
    }
}

export const calldeleteDocInStorageAPI = ({adCode, abCode}) => {
    return async (dispatch, getState) => {
        await request('DELETE', `/approval/deleteDocInStorage?adCode=${adCode}&abCode=${abCode}`);
    }
}
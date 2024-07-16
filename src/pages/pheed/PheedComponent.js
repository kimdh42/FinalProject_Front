import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { EventSourcePolyfill } from 'event-source-polyfill';

const PheedComponent = () => {
    const [pheeds, setPheeds] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('access-token'));
    const [sseEventSource, setSseEventSource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responseMessage, setResponseMessage] = useState('');
    const [unreadPostCount, setUnreadPostCount] = useState(0);
    const sseURL = "http://localhost:8080/api/pheed/subscribe";

    useEffect(() => {
        const unreadCount = countUnreadPosts();
        setUnreadPostCount(unreadCount);
    }, [pheeds]);

    useEffect(() => {
        let eventSource = null;

        const connectSSE = () => {
            if (eventSource) {
                eventSource.removeEventListener('newPheed', handleNewPheed);
                eventSource.close();
            }

            eventSource = new EventSourcePolyfill(sseURL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            eventSource.addEventListener('newPheed', handleNewPheed);

            eventSource.onerror = (err) => {
                console.error("EventSource failed:", err);
                eventSource.close();

                setTimeout(connectSSE, 5000); // 재연결 시도
            };

            setSseEventSource(eventSource);
        };

        connectSSE();

        return () => {
            if (eventSource) {
                eventSource.removeEventListener('newPheed', handleNewPheed);
                eventSource.close();
            }
        };
    }, [token]);

    const fetchPheeds = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/pheed/list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            const pheedList = response.data.results.pheeds || [];

            setPheeds(pheedList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pheeds:", error);
            setLoading(false);
        }
    }, [token]);

    const handleNewPheed = (event) => {
        fetchPheeds();
    };

    useEffect(() => {
        fetchPheeds();
    }, [fetchPheeds]);

    const handleDetailClick = async (url, pheedCode, e) => {
        e.preventDefault();

        try {
            if (url) {
                const response = await axios.put(`http://localhost:8080/api/pheed/update-readStatus/${pheedCode}`);
                setResponseMessage(response.data.message);
                window.location.href = url;
            } else {
                console.error('URL이 없습니다.');
            }
        } catch (error) {
            console.error('Error updating read status:', error);
            setResponseMessage('읽음 처리 실패');
        }
    };

    const handleDeleteClick = async (pheedCode) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                const response = await axios.put(`http://localhost:8080/api/pheed/update-deStatus/${pheedCode}`);
                setResponseMessage(response.data.message);
                await fetchPheeds();
                window.alert('삭제 완료');
            } catch (error) {
                console.error('Error deleting pheed:', error);
                setResponseMessage('삭제 실패');
            }
        } else {
            console.log('삭제 취소됨');
        }
    };

    const countUnreadPosts = () => {
        return pheeds.reduce((count, pheed) => {
            if (pheed.readStatus === 'N') {
                return count + 1;
            }
            return count;
        }, 0);
    };

    const getDisplayText = (pheedSort) => {
        if (pheedSort.includes('AD')) {
            return '결재';
        } else if (pheedSort.includes('PO')) {
            return '게시판';
        } else if (pheedSort.includes('MS')) {
            return '쪽지';
        } else {
            return pheedSort;
        }
    };

    const shouldDisplayEmpName = (pheed) => {
        if (pheed.pheedSort.includes('AD') && pheed.pheedCon.includes('님이')) {
            return false;
        }
        return true;
    };

    const isPOorMS = (pheedSort) => {
        return pheedSort.includes('PO') || pheedSort.includes('MS');
    };

    const getSortClass = (pheedSort) => {
        if (pheedSort.includes('AD')) {
            return 'bl_sort_approval';
        } else if (pheedSort.includes('MS')) {
            return 'bl_sort_msg';
        } else if (pheedSort.includes('PO')) {
            return 'bl_sort_po';
        }
        // 기본적으로 추가할 클래스가 없는 경우
        return '';
    };

    return (
        <>
            <h4 className="el_lv1Head hp_mb10">실시간 알림<b className="bl_mainBoard__alarm hp_ml10">{unreadPostCount}</b></h4>
            <div className="bl_mainBoard" style={{height: '720px'}}>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        {pheeds.map(pheed => (
                            <section key={pheed.pheedCode} className={`bl_sect el_shadowD4 ly_spaceBetween ly_fitemC hp_p20-30 hp_mt15 ${pheed.readStatus === 'Y' ? 'bl_mainBoard__read' : ''}`}>
                                <div className="ly_flex ly_fitemC">
                                    <div className={getSortClass(pheed.pheedSort)}></div>
                                    <ul className="hp_ml20">
                                        <li className="hp_fs16 hp_fw400">
                                            {isPOorMS(pheed.pheedSort) ? (
                                                <b className="hp_fw700">{pheed.pheedCon}</b>
                                            ) : (
                                                <>
                                                    {shouldDisplayEmpName(pheed) && (
                                                        <>
                                                            <b className="hp_fw700">{pheed.empName || 'Unknown'}</b>님이 상신한&nbsp;&nbsp;
                                                        </>
                                                    )}
                                                    <b className="hp_fw700">{pheed.pheedCon}</b>
                                                </>
                                            )}
                                        </li>
                                        <li className="hp_7Color hp_fs13 hp_mt5">{getDisplayText(pheed.pheedSort)}
                                            <span className="hp_ml10 hp_mr10">/ &nbsp;&nbsp;{pheed.creStatus}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="ly_flex ly_fitemC">
                                    <a className="el_btnS el_btnblueBack hp_ml30" href={pheed.url} onClick={(e) => handleDetailClick(pheed.url, pheed.pheedCode, e)}>
                                        상세보기
                                    </a>
                                    <button
                                        type="button"
                                        className="bl_mainBoard__delete hp_ml20"
                                        onClick={() => handleDeleteClick(pheed.pheedCode)}
                                    ></button>
                                </div>
                            </section>
                        ))}
                    </>
                )}
            </div>
        </>
    );
};

export default PheedComponent;

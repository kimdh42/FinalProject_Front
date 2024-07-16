import React from 'react';

const CurrentStatus = ({ document, isOpen, toggle }) => {

    return (
        <div>
            <section className={`time_table bl_sect el_shadowD4 section2 ${isOpen ? 'go' : ''}`}>
                <ul className="bl_listRing" style={{ paddingTop: '30px', paddingRight: '10px' }}>
                    {document && document.length > 0 ? (
                        document.map((data, index) => (
                            <li className="bl_tnaWeek" key={index} >
                                <div className="ly_flex ly_fitemC">
                                    <div className="hp_fw700 hp_fs18 bl_tnaWeek__ttl letter03">{data.adReportDate}</div>
                                    <div className="">
                                        <ul className="ly_fgrow1 bl_tnaWeek__list"
                                            style={{display: 'flex', justifyContent: 'flex-end'}}>
                                            <li style={{margin: '0 10px', width: ''}}> &nbsp;{data.adStatus}
                                            </li>
                                            <li style={{margin: '0 10px', width: ''}}> &nbsp;{data.adTitle}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="bl_tnaWeek">데이터가 없습니다.</li>
                    )}
                </ul>
            </section>
        </div>
    );
};

export default CurrentStatus;

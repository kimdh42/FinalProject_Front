function PagingBar({pageInfo, setCurrentPage}){
    if (!pageInfo) return null;     // pageInfo가 없으면 렌더링을 하지 않음

    const { currentPage, maxPage } = pageInfo;
    const pageNumbers = Array.from({ length: maxPage }, (_, index) => index + 1);
  
    // 현재 페이지 기준으로 보여줄 페이지 번호 범위 계산
    const startPage = Math.max(1, currentPage - 2); // 현재 페이지 기준으로 2 페이지 이전부터 시작
    const endPage = Math.min(startPage + 4, maxPage); // 시작 페이지부터 4 페이지까지만 보여주기 (최대 5개 버튼)

    return(
        <section className="bl_sect hp_mt10 hp_padding5 hp_alignC">
            <div className="bl_paging">                
                <button className="bl_paging__btn bl_paging__prev" title="이전 페이지로 이동"
                    onClick={() => setCurrentPage(pageInfo.currentPage-1)} disabled={pageInfo.currentPage <= 1}>
                </button>
                {pageNumbers.slice(startPage - 1, endPage).map(number => (
                    <button key={number} onClick={() => setCurrentPage(number)} className="bl_paging__btn bl_paging__num"
                            style={{ color: currentPage === number ? 'blue' : 'inherit' }}>{number}</button>
                ))}
                <button className="bl_paging__btn bl_paging__next" title="다음 페이지로 이동"
                    onClick={() => setCurrentPage(pageInfo.currentPage+1)} disabled={pageInfo.currentPage >= pageInfo.maxPage}>
                </button>

            </div>
        </section>
    )
}
export default PagingBar;
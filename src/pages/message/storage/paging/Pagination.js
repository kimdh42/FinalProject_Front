function Pagination({ messages =[], currentPage, setCurrentPage }) {

    const itemsPerPage = 10;
    const totalPages = Math.ceil(messages.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const pageNumber = [];
    
    for (let i = 1; i <= totalPages; i++) {
        pageNumber.push(i);
    }
    
    return (
        <div className="bl_paging">

            <button 
                className="bl_paging__btn bl_paging__first" 
                title="첫 페이지로 이동"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
            >
            </button>
            <button 
                className="bl_paging__btn bl_paging__prev" 
                title="이전 페이지로 이동"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
            </button>
            {pageNumber.map(number => (
                <button 
                    className="bl_paging__btn bl_paging__num"
                    key={number}
                    onClick={() => handlePageChange(number)}
                    >
                    {number}
                </button>
            ))}
            <button 
                className="bl_paging__btn bl_paging__next" 
                title="다음 페이지로 이동"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                >
            </button>
            <button 
                className="bl_paging__btn bl_paging__last" 
                title="마지막 페이지로 이동"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
            </button>
        </div>
    );
}

export default Pagination;
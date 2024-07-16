import PostDirForm from "./PostDirForm";

function PostAddressDir({ Roll,LowBoardCode,isOpen, closeModal, onConfirm, onClear,defaultData }) {
// console.log("middle",Roll,LowBoardCode)
    return (
        <div className="modal-overlay" style={{display: isOpen ? "flex" : "none"}}>
            <div className="modal-content" id="modal">
                <section className="bl_sect ly_flex" style={{height: 'calc(100% - 30px - 42px)'}}>
                    <PostDirForm closeModal={closeModal} onConfirm={onConfirm} onClear={onClear} defaultData={defaultData} LowBoardCode={LowBoardCode} Roll={Roll} />
                </section>
            </div>
        </div>
    )
}

export default PostAddressDir;
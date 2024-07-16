import DirForm from "./DirForm";

function AddressDir({ isOpen, closeModal, onConfirm, onClear }) {

    return (
        <div className="modal-overlay" style={{display: isOpen ? "flex" : "none"}}>
            <div className="modal-content" id="modal">
                <section className="bl_sect ly_flex" style={{height: 'calc(100% - 30px - 42px)'}}>
                    <DirForm closeModal={closeModal} onConfirm={onConfirm} onClear={onClear}/>
                </section>
            </div>
        </div>
    )
}

export default AddressDir;
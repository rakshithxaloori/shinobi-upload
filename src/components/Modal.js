import "../styles/modal.css";

const Modal = ({ title, handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <span style={{ fontWeight: "bold", fontSize: 20 }}>{title}</span>
        <span
          style={{ position: "absolute", top: 20, right: 20 }}
          onClick={handleClose}
        >
          <ion-icon name="close"></ion-icon>
        </span>
        <div style={{ marginTop: 40 }}>{children}</div>
      </section>
    </div>
  );
};

export default Modal;

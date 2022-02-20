import { IoClose } from "react-icons/io5";
import "../styles/modal.css";
import { defaultIconStyle } from "../utils/styles";

const Modal = ({ title, handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <section
          style={{
            width: "100%",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: 20 }}>{title}</span>
          <span
            style={{ position: "absolute", right: 20, top: 20 }}
            onClick={handleClose}
          >
            <IoClose style={defaultIconStyle} />
          </span>
        </section>
        <div
          style={{
            marginTop: 40,
          }}
        >
          {children}
        </div>
      </section>
    </div>
  );
};

export default Modal;

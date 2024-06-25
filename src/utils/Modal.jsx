import PropTypes from "prop-types";

const Modal = ({ children, modal, setModal }) => {
  return (
    <>
      <div
        onClick={() => setModal(false)}
        className={`bg-white/50 fixed inset-0 z-10 
        ${
          modal ? "visible opacity-100" : "invisible opacity-0"
        } transition-all duration-500`}
      />
      {children}
    </>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  modal: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
};

export default Modal;

import PropTypes from "prop-types";
import { useEffect } from "react";

const Modal = ({ children, modal, setModal }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        console.log("Escape key pressed");
        setModal(false);
      }
    };

    if (modal) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal, setModal]);

  const handleBackgroundClick = () => {
    setModal(false);
  };

  return (
    <>
      <div
        onClick={handleBackgroundClick}
        className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-500
        ${modal ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />
      <div
        className={`fixed inset-0 z-20 flex items-center justify-center pointer-events-none
        ${modal ? "opacity-100 visible" : "opacity-0 invisible"} 
        transition-opacity duration-500`}
      >
        <div className="pointer-events-auto">{children}</div>
      </div>
    </>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  modal: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
};

export default Modal;

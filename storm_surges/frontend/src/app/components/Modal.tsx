import React from "react";

const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({
  onClose,
  children,
}) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100000,
    }}
  >
    <div
      style={{
        background: "linear-gradient(to right, yellow, #F76501)",
        borderRadius: "5px",
        maxWidth: "600px",
        width: "90%",
        maxHeight: "80vh", // Ensure modal doesn't take up the full viewport height
        overflow: "hidden", // Prevent the modal itself from resizing
        position: "relative",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "20px",
          background: "transparent",
          border: "none",
          fontSize: "36px",
          cursor: "pointer",
          color: "white",
        }}
      >
        ×
      </button>
      <div
        style={{
          padding: "5px",
          maxHeight: "calc(80vh - 40px)", // Account for padding and close button
          overflowY: "auto", // Enable scrolling for content overflow
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

export default Modal;

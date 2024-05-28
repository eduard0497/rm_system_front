import React, { useEffect, useState } from "react";

function Modal({
  modal,
  setmodal,
  message,
  setmessage,
  confirmable,
  functionIfConfirmed,
}) {
  const closeMessage = () => {
    setmessage("");
    setmodal(false);
  };

  if (!modal || !message) return;

  return (
    <div className="modal_background">
      <div className="modal_box">
        {/* <div className="modal_box_close_button">
          <button onClick={closeMessage}>X</button>
        </div> */}
        <h1>{message}</h1>
        {confirmable ? (
          <div className="row_space_around">
            <button onClick={closeMessage}>Cancel</button>
            <button onClick={functionIfConfirmed}>Confirm</button>
          </div>
        ) : (
          <div className="modal_box_ok_button">
            <button onClick={closeMessage}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;

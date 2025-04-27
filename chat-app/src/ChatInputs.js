import { useState } from "react";
import FileUpload from "./FileUpload";

const ChatInputs = ({ sendMessage, handleFileUpload }) => {
  const [text, setText] = useState("");
  // const [attachments, setAttachments] = useState([]);
  // const [previewUrls, setPreviewUrls] = useState([]);
  const sendText = () => {
    sendMessage(text);
    setText("");
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendText();
      }}
    >
      <div className="input-group">
        <div className="input-group-append">
          <span className="input-group-text attach_btn">
            <i className="fas fa-paperclip"></i>
          </span>
        </div>

        <textarea
          className="form-control type_msg"
          placeholder="Type your message..."
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              if (!e.shiftKey) {
                sendText();
              }
            }
          }}
          onChange={(e) => {
            setText(e.target.value);
          }}
          value={text}
        ></textarea>
        <div className="input-group-append">
          <span
            className="input-group-text send_btn"
            style={{ height: "100%" }}
            onClick={() => {
              sendText();
            }}
          >
            <i className="fas fa-paper-plane"></i>
          </span>
          {/* <FileUpload onFileUpload={handleFileUpload} /> */}
        </div>
      </div>
    </form>
  );
};

export default ChatInputs;

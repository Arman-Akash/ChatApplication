import React, { useRef, useState } from "react";

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      onFileUpload(file);
      setFile(null); // Reset file input
    }
  };

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*,application/pdf"
        id="selectFile"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button
        onClick={handleClick}
        className="btn btn-small pt-0 pb-0"
        type="button"
        title="Select File"
      >
        <i className="fa fa-file-import"></i>
      </button>
      <button type="button" onClick={handleUpload}>Send</button>
    </div>
  );
};

export default FileUpload;

import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { v4 as uuidv4 } from "uuid";
import { apiUrl } from "./config";
import "./Chat.css";
import * as keys from "./Axios/keys";
import * as storage from "./Axios/storage";
import * as axios from "./Axios/Axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import EmptyAvatar from "./EmptyAvatar";

const Chat = () => {
  var user = storage.loadState(keys.LOGGED_IN_USER);
  const navigator = useNavigate();

  const { id } = useParams();
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);
  const [chatUsers, setChatUsers] = useState([]);
  const [showTextBox, setShowTextBox] = useState(false);
  latestChat.current = chat;
  const [message, setMessage] = useState("");
  const [selectedUser, setSeletedUser] = useState(null);
  const [count, setCount] = useState(1);

  const msgEnd = useRef(null);
  const scrollToBottom = () => {
    msgEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onMessageUpdate = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(apiUrl + "/hubs/chat")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    // console.log(id, chatUsers)
    if (id !== undefined) {
      setSeletedUser(chatUsers.find((e) => e.id === id));
    }
  }, [id, chatUsers]);

  useEffect(() => {
    //get users
    axios.get(`api/chat/GetUsers`, undefined, (response) => {
      setChatUsers(response.data);
    });
  }, [setChatUsers]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          connection
            .invoke("JoinGroup", user?.user_id?.toString())
            .catch((err) => {
              console.log(err);
            });

          connection.on("ReceiveMessage", (message) => {
            console.log(message);
            // message.time = new Date().getHours() + ":" + new Date().getMinutes()
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);
            setChat(updatedChat);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const sendMessage = async (message) => {
    if (message !== "") {
      const chatMessage = {
        user: user.user_id,
        message: message,
        receiver: selectedUser?.id,
      };
      const updatedChat = [...latestChat.current];
      updatedChat.push(chatMessage);
      setChat(updatedChat);
      // console.log(connection._connectionStarted);
      if (connection._connectionStarted) {
        try {
          // await connection.send("SendMessage", chatMessage);
          axios.post(`api/Chat`, chatMessage);
          setMessage("");
        } catch (e) {
          console.log(e);
        }
      } else {
        // alert('No connection to server yet.');
        console.log("No connection to server yet.");
      }
    }
  };

  var selectUser = (user) => {
    setShowTextBox(true);
    setSeletedUser(user);
  };

  const getMessage = () => {
    axios.get(
      `api/chat/GetMessages/${selectedUser?.id}/${count}`,
      undefined,
      (response) => {
        // console.log(response.data);
        var c = response.data.map((e) => ({
          user: e.senderId,
          receiver: e.receiverId,
          message: e.content,
          time: e.time,
        }));
        setChat([...c, ...chat]);
        // const { scrollTop } = msgBoxRef.current;
        // scrollTop = 10;
        if (c.length > 0) {
          setCount((e) => e + 1);
        }
      }
    );
  };

  useEffect(() => {
    if (selectedUser && selectedUser.id !== undefined) {
      axios.get(
        `api/chat/GetMessages/${selectedUser?.id}/${1}`,
        undefined,
        (response) => {
          // console.log(response.data);
          var c = response.data.map((e) => ({
            user: e.senderId,
            receiver: e.receiverId,
            message: e.content,
            time: e.time,
          }));
          setChat([...c]);
          setCount(2);
        }
      );
    }
  }, [selectedUser]);

  useEffect(() => {
    if (count === 2) {
      scrollToBottom();
    }
  }, [count]);

  const msgBoxRef = useRef();

  const onScroll = () => {
    if (msgBoxRef.current) {
      const { scrollTop } = msgBoxRef.current;
      // console.log(scrollTop);
      if (scrollTop === 0) {
        getMessage();
        msgBoxRef.current.scrollTop = 100;
      }
    }
  };

  const handleFileUpload = (file) => {
    axios.postFormData(
      `api/upload`,
      null,
      null,
      [{ name: "file", attachment: file }],
      (response) => {
        // Handle the response, e.g., display the uploaded file
        console.log(response.data.filePath);
        displayFile(response.data.filePath);
      }
    );
  };

  const displayFile = (filePath) => {
    const imgElement = document.createElement("img");
    imgElement.src = apiUrl + "/" + filePath;
    document.getElementById("msg_card_body").appendChild(imgElement);
  };
  const logout = () => {
    storage.removeState(keys.LOGGED_IN_USER);
    navigator("/signin");
  };
  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row vh-100">
        <div
          className="col-md-4 col-xl-3 chat pl-0 pr-0"
          style={{ paddingRight: "5px" }}
        >
          <div className="card mb-sm-3 mb-md-0 contacts_card br-0 h-100vh">
            <div className="card-header">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search..."
                  name=""
                  className="form-control search"
                />
                <div className="input-group-prepend">
                  <span
                    className="input-group-text search_btn"
                    style={{ height: "100%" }}
                  >
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body contacts_body">
              <ul className="contacts" style={{ overflow: "auto" }}>
                {chatUsers?.map((e) => (
                  <li
                    className={
                      `clearfix` + selectedUser?.id === e.id ? " active" : ""
                    }
                    key={uuidv4()}
                    // className="clearfix"
                    onClick={() => selectUser(e)}
                  >
                    <div className="d-flex bd-highlight">
                      <div className="img_cont">
                        {e.photo ?? e.photo !== null ? (
                          <img
                            src={`${apiUrl}/${e.photo}`}
                            alt={e.name[0]}
                            className="rounded-circle user_img"
                          />
                        ) : (
                          <EmptyAvatar name={e.name} />
                        )}
                        {/* <span className="online_icon"></span> */}
                      </div>
                      <div className="user_info">
                        <span>{e.name}</span>
                        {/* <p>Kalid is online</p> */}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div
          className="col-md-8 col-xl-9 chat pl-0 pr-0"
          style={{ paddingLeft: "0", paddingRight: "0" }}
        >
          <div className="card br-0 h-100vh">
            <div className="card-header msg_head">
              <div className="d-flex justify-content-between bd-highlight">
                <div className="d-flex bd-highlight">
                  {selectedUser && (
                    <>
                      <div className="img_cont">
                        {selectedUser?.photo ?? selectedUser?.photo !== null ? (
                          <img
                            src={`${apiUrl}/${selectedUser?.photo}`}
                            className="rounded-circle user_img"
                            alt={selectUser?.name[0]}
                          />
                        ) : (
                          <EmptyAvatar name={selectedUser.name} />
                        )}
                        {/* <span className="online_icon"></span> */}
                      </div>
                      <div className="user_info">
                        <span>{selectedUser?.name}</span>
                      </div>
                    </>
                  )}
                </div>

                <div
                  className="bd-highlight"
                  style={{ marginTop: "auto", marginBottom: "auto" }}
                  onClick={logout}
                >
                  Logout
                </div>
              </div>
            </div>
            <div
              className="card-body msg_card_body"
              id="msg_card_body"
              ref={msgBoxRef}
              onScroll={onScroll}
            >
              {chat &&
                chat.map((item) => {
                  return user.user_id === item.user ? (
                    //own message
                    <div
                      className="d-flex justify-content-end mb-4"
                      key={uuidv4()}
                    >
                      <div className="msg_cotainer_send" id="msg_cotainer_send">
                        {item.message}
                        <span className="msg_time_send">{item.time}</span>
                      </div>
                      {/* <div className="img_cont_msg">
                        {user?.photo ?? user.photo !== null ? (
                          <img
                            src={`${apiUrl}/${user?.photo}`}
                            className="rounded-circle user_img_msg"
                            alt={user?.name[0]}
                          />
                        ) : (
                          <EmptyAvatar name={user?.name} />
                        )}
                      </div> */}
                    </div>
                  ) : user.user_id === item.receiver &&
                    item.user === selectedUser?.id ? (
                    <div
                      className="d-flex justify-content-start mb-4"
                      key={uuidv4()}
                    >
                      <div className="img_cont_msg">
                        {selectedUser?.photo ?? selectedUser?.photo !== null ? (
                          <img
                            src={`${apiUrl}/${selectedUser?.photo}`}
                            className="rounded-circle user_img_msg"
                            alt={user?.name[0]}
                          />
                        ) : (
                          <EmptyAvatar name={selectedUser?.name} />
                        )}
                      </div>
                      <div className="msg_cotainer">
                        {item.message}
                        <span className="msg_time">{item.time}</span>
                      </div>
                    </div>
                  ) : null;
                })}
              <div ref={msgEnd}></div>
            </div>
            <div
              className="card-footer"
              style={{
                display: showTextBox ? "block" : "none",
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(message);
                }}
              >
                <div className="input-group">
                  {/* <div className="input-group-append">
                                    <span className="input-group-text attach_btn">
                                        <i className="fas fa-paperclip"></i>
                                    </span>
                                </div> */}

                  <textarea
                    className="form-control type_msg"
                    placeholder="Type your message..."
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        if (!e.shiftKey) {
                          sendMessage(message);
                        }
                      }
                    }}
                    onChange={(e) => {
                      onMessageUpdate(e);
                    }}
                    value={message}
                  ></textarea>
                  <div className="input-group-append">
                    <span
                      className="input-group-text send_btn"
                      style={{ height: "100%" }}
                      onClick={(e) => {
                        sendMessage(message);
                      }}
                    >
                      <i className="fas fa-location-arrow"></i>
                    </span>
                    <FileUpload onFileUpload={handleFileUpload} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { apiUrl } from "./config";
import "./Chat.css";
import * as keys from "./Axios/keys";
import * as storage from "./Axios/storage";
import * as axios from "./Axios/Axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EmptyAvatar from "./EmptyAvatar";
import ChatList from "./ChatList";
import ChatBody from "./ChatBody";
import ChatInputs from "./ChatInputs";

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
  const [selectedUser, setSeletedUser] = useState(null);
  const [count, setCount] = useState(1);

  const msgEnd = useRef(null);
  const scrollToBottom = () => {
    msgEnd.current?.scrollIntoView({ behavior: "smooth" });
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
          // setMessage("");
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

  // const getMessage = () => {
  //   axios.get(
  //     `api/chat/GetMessages/${selectedUser?.id}/${count}`,
  //     undefined,
  //     (response) => {
  //       // console.log(response.data);
  //       var c = response.data.map((e) => ({
  //         user: e.senderId,
  //         receiver: e.receiverId,
  //         message: e.content,
  //         time: e.time,
  //       }));
  //       setChat([...c, ...chat]);
  //       // const { scrollTop } = msgBoxRef.current;
  //       // scrollTop = 10;
  //       if (c.length > 0) {
  //         setCount((e) => e + 1);
  //       }
  //     }
  //   );
  // };

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

  // const msgBoxRef = useRef();

  // const onScroll = () => {
  //   if (msgBoxRef.current) {
  //     const { scrollTop } = msgBoxRef.current;
  //     // console.log(scrollTop);
  //     if (scrollTop === 0) {
  //       getMessage();
  //       msgBoxRef.current.scrollTop = 100;
  //     }
  //   }
  // };

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
          <ChatList
            chatUsers={chatUsers}
            selectedUser={selectedUser}
            selectUser={selectUser}
          />
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
                            alt={selectedUser?.name[0]}
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
            <ChatBody
              setChat={setChat}
              chat={chat}
              user={user}
              selectedUser={selectedUser}
              msgEnd={msgEnd}
            />

            <div
              className="card-footer"
              style={{
                display: showTextBox ? "block" : "none",
              }}
            >
              <ChatInputs
                sendMessage={sendMessage}
                handleFileUpload={handleFileUpload}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

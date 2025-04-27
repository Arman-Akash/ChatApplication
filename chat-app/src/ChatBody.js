import { apiUrl } from "./config";
import { v4 as uuidv4 } from "uuid";
import EmptyAvatar from "./EmptyAvatar";
import { useRef, useState } from "react";
import * as axios from "./Axios/Axios";

const ChatBody = ({chat, setChat, user, selectedUser, msgEnd }) => {
  const msgBoxRef = useRef();  
  const [count, setCount] = useState(1);

  

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
  return (
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
            <div className="d-flex justify-content-end mb-4" key={uuidv4()}>
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
            <div className="d-flex justify-content-start mb-4" key={uuidv4()}>
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
  );
};

export default ChatBody;

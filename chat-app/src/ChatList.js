import { v4 as uuidv4 } from "uuid";
import { apiUrl } from "./config";
import EmptyAvatar from "./EmptyAvatar";

const ChatList = ({ chatUsers, selectedUser, selectUser }) => {
  return (
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
  );
};

export default ChatList;

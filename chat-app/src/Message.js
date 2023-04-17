import React from 'react';
// import * as keys from '../Axios/keys';
// import * as storage from '../Axios/storage';

const Message = (props) => {
    // var user = storage.loadState(keys.LOGGED_IN_USER);
    var date = new Date();
    return (
        <>
            {/* <div style={{ background: "#eee", borderRadius: '5px', padding: '0 10px' }}>
            <p><strong>{props.user}</strong></p>
            <p>{props.message}</p>
        </div> */}

            <ul className="m-b-0">
                {
                    user.user_id == props.user ?
                        <li className="clearfix">
                            <div className="message-data float-right">
                                <span className="message-data-time">{date.getHours()}:{date.getMinutes()} am</span>
                                {/* {props.user} */}
                                {/* <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" /> */}
                            </div>
                            <div className="message other-message float-right"> {props.message} </div>
                        </li> : user.user_id == props.receiver && props.user == props.selectedUser?.id?
                        <li className="clearfix">
                            <div className="message-data">
                                <span className="message-data-time">{date.getHours()}:{date.getMinutes()} am</span>
                            </div>
                            <div className="message my-message">{props.message}</div>
                        </li>:<></>
                }



                {/* <li className="clearfix">
                <div className="message-data">
                    <span className="message-data-time">10:15 AM, Today</span>
                </div>
                <div className="message my-message">Project has been already finished and I have results to show you.</div>
            </li> */}
            </ul>
        </>
    )
};

export default Message;
import React, {useContext} from "react";

import { SocketContext } from "../Context.js";


const Notifications = () => {
    const {call,answerCall,callAccepted} = useContext(SocketContext);  // using specific states from SocketContext

    // shows the caller info and enables answer button
    return (
        <>
        {call.isReceivingCall && !callAccepted && 
            (<div className="notifications">
                <h2>{call.name} is calling...</h2>
                <button onClick={answerCall} id="answer__btn">Answer <i className="fas fa-phone" id="icon"></i></button>
            </div>)
        }
        </>
    );
};

export default Notifications;
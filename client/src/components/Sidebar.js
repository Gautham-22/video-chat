import React, {useContext, useState} from "react";

import { SocketContext } from "../Context.js";


const Sidebar = () => {
    const {name, setName, me, callUser, leaveCall, callAccepted, callEnded} = useContext(SocketContext); // using specific states from SocketContext

    const [idToCall, setIdToCall] = useState("");

    // copying our id and we can send it to the person we need to call through other platforms
    // Once that person uses our id and call, we will get a notification
    // displays hangup button during call and make call button before/after the call 
    return (
        <div className="sidebar">
            <input type="text" value={name} placeholder="Your name" onChange={(e) => {setName(e.target.value)}} />
            <button onClick={() => {navigator.clipboard.writeText(me)}}>Copy your id</button>

            <input type="text" value={idToCall} placeholder="Id to call" onChange={(e) => {setIdToCall(e.target.value)}} />
            {(
                (callAccepted && !callEnded) 
                ? <button onClick={() => {leaveCall()}}>Hangup call</button>
                : <button onClick={() => {callUser(idToCall)}}>Make a call</button>
            )}
        </div>
    );
};

export default Sidebar;
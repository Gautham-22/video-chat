import React, {useContext} from "react";

import { SocketContext } from "../Context.js";


const VideoPlayer = () => {
    const {stream, myVideo, userVideo, name, call, callAccepted, callEnded} = useContext(SocketContext); // using specific states from SocketContext

    // displaying our stream when available and setting user's stream during the call
    return (
        <div className="videoplayer">
            {(stream && (
                <div className="video-container">
                    <h1>{name}</h1>
                    <video ref={myVideo} autoPlay muted />
                </div>
            ))}
            {(callAccepted && !callEnded && (
                <div className="video-container">
                    <h1>{call.name}</h1>
                    <video ref={userVideo} autoPlay />
                </div>
            ))} 
        </div> 
    );
};

export default VideoPlayer;
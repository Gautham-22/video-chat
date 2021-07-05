import React, {useContext} from "react";

import { SocketContext } from "../Context.js";


const VideoPlayer = () => {
    const {stream, myVideo, userVideo, name, call, callAccepted, callEnded} = useContext(SocketContext);

    return (
        <div className="videoplayer">
            {(stream && (
                <div>
                    <h1>{name}</h1>
                    <video ref={myVideo} autoPlay muted />
                </div>
            ))}
            {(callAccepted && !callEnded && (
                <div>
                    <h1>{call.name}</h1>
                    <video ref={userVideo} autoPlay />
                </div>
            ))} 
        </div> 
    );
};

export default VideoPlayer;
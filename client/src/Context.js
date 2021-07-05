import React, {createContext, useEffect, useState, useRef} from "react";

const Peer = require("simple-peer");
const {io} = require("socket.io-client");
const socket = io("http://localhost:5000");

export const SocketContext = createContext();

export const ContextProvider = ({children}) => {

    const [me, setMe] = useState("");
    const [name, setName] = useState("");
    const [stream, setStream] = useState("");
    const [call,setCall] = useState({});
    const [callAccepted,setCallAccepted] = useState();
    const [callEnded,setCallEnded] = useState();

    const myVideo = useRef({});
    const userVideo = useRef({});
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video : true,audio : true})
        .then((stream) => {
            setStream(stream);
            myVideo.current.srcObject = stream;
        })
        
        socket.on("me",(id) => {  
           setMe(id);
        }); 

        // for receiving call notification
        socket.on("calluser",({from,name : callerName,signalData}) => {
            setCall({isReceivingCall : true,from,name : callerName,signalData})
        })
        
    },[])

    const answerCall = () => {
        setCallAccepted(true);

        const peer = new Peer({initiator:false, trickle:false, stream});

        peer.on("signal",(data) => {
            socket.emit("answerUser",{signal : data,to : call.from, calledUsername : name});
        })

        peer.on("stream",(currentStream) => {
            userVideo.current.srcObject = currentStream;
        })

        peer.signal(call.signalData);

        connectionRef.current = peer;
    }

    const callUser = (id) => {
        const peer = new Peer({initiator:true, trickle:false, stream});

        peer.on("signal",(data) => {
            socket.emit("calluser",{signalData : data,from : me,name,idToCall : id});
        })

        peer.on("stream",(currentStream) => {
            userVideo.current.srcObject = currentStream;
        })

        socket.on("callAccepted",({signal,name}) => {
            setCallAccepted(true);
            setCall({name});
            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload(); // for initializing the state variables to default -- equivalent to opening app for 1st tym 
    }

    return (
        <SocketContext.Provider value={{
            name,setName,
            me,
            stream,
            call,
            callAccepted,
            callEnded,
            myVideo,
            userVideo,
            callUser,
            answerCall,
            leaveCall
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export default ContextProvider;
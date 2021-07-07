import React, {createContext, useEffect, useState, useRef} from "react";

const Peer = require("simple-peer");
const {io} = require("socket.io-client");
const socket = io("https://video-chatter-app.herokuapp.com/");  // connects client socket to the server's socket.io listening - triggers 'connection' event
// const socket = io("http://localhost:5000");

export const SocketContext = createContext();

export const ContextProvider = ({children}) => {

    const [me, setMe] = useState("");
    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [stream, setStream] = useState("");
    const [call,setCall] = useState({});
    const [callAccepted,setCallAccepted] = useState();
    const [callEnded,setCallEnded] = useState();

    const myVideo = useRef({});
    const userVideo = useRef({});
    const connectionRef = useRef();

    useEffect(() => {               // this function will be executes once when the component mounts
        navigator.mediaDevices.getUserMedia({video : true,audio : true})
        .then((stream) => {
            setStream(stream);      // storing the stream for future use
            myVideo.current.srcObject = stream;   // myVideo.current is the html element(video tag) that has attribute of ref={myVideo}
        })                                        // hence setting srcObject of video tag to the stream                       
        
        
        socket.on("me",(id) => {    // storing the socket's id for future use
           setMe(id);                   
        }); 

        // for receiving calls and call notification
        socket.on("calluser",({from,name : callerName,signalData}) => {  // signalData corresponds to caller's stream
            setCall({isReceivingCall : true,from,name : callerName,signalData});  // once this is set, notification gets triggered
        })
        
    },[])

    const answerCall = () => {
        setCallAccepted(true);   // removes notification and enables hangup button

        setUserId(call.from);  // stores id of the user who is in call

        const peer = new Peer({initiator:false, trickle:false, stream});  // creates peer connection with user stream

        peer.on("signal",(data) => {   // makes the caller to access user stream, name 
            socket.emit("answerUser",{signal : data,to : call.from, calledUsername : name});
        })

        peer.on("stream",(currentStream) => {
            userVideo.current.srcObject = currentStream;  // setting up our stream for user
        })

        peer.signal(call.signalData);  // emits stream event on user's peer with our stream

        connectionRef.current = peer;  // storing the peer for the future use of destroying it while ending call
    }

    const callUser = (id) => {
        const peer = new Peer({initiator:true, trickle:false, stream});  // establishing a peer connection with our stream

        peer.on("signal",(data) => {   // once new Peer() returns a signal using our stream, this event is triggered
            socket.emit("calluser",{signalData : data,from : me,name,idToCall : id});
        })

        peer.on("stream",(currentStream) => {
            userVideo.current.srcObject = currentStream;  // userVideo.current corresponds to the video element of other user
        })

        socket.on("callAccepted",({signal,name}) => {
            setCallAccepted(true);  // removes call button enables hangup button
            setCall({name});        // for displaying the name which corresponds to the id we have called
            setUserId(id);          // stores the id of user whom we called 
            peer.signal(signal);    // emits stream event on our peer with user stream
        });

        connectionRef.current = peer;  // storing the peer for the future
    }

    const leaveCall = ({othersInCall}) => {
        setCallEnded(true); // removes hangup call button and removes user stream

        connectionRef.current.destroy(); // destroying the stored peer connection

        if(othersInCall) {                      // if other user is still in call
            socket.emit("leaveCall",{userId});  // for ending call on other user's side
        }   

        window.location.reload(); // for initializing the state variables to default -- equivalent to opening app for 1st tym 
    }

    socket.on("leaveCall",() => {
        leaveCall({othersInCall : false});  // indicating that one user already left
    })

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
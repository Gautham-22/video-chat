require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/",(req,res) => {
    res.send("Server started running...");
})

const server = app.listen(PORT);

const io = require("socket.io")(server, {  // making socket.io to connect with our server
    cors : {
        origin : "*",
        methods : ["GET","POST"]
    }
})

app.use(cors());

io.on("connection",(socket) => {   // io listening on connection event will get access to the socket that connects
    //console.log("Socket connection made");

    socket.emit("me",socket.id);   
    //console.log(socket.id);

    socket.on("calluser",({signalData,from,name,idToCall}) => {     // for making calls
        io.to(idToCall).emit("calluser",{from,name,signalData});    // making the receiver to access our name, id and stream
    })

    socket.on("answerUser",({signal,to,calledUsername}) => {         // for answering calls
        io.to(to).emit("callAccepted",{signal,name:calledUsername}); // making the caller to access receiver name and stream 
    })

    socket.on("leaveCall",({userId}) => {   // ending call on other side
        io.to(userId).emit("leaveCall");
    })
})
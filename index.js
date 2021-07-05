require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server started running on ${PORT}`);
});

const io = require("socket.io")(server, {
    cors : {
        origin : "*",
        methods : ["GET","POST"]
    }
})

io.on("connection",(socket) => {
    console.log("Socket connection made");

    socket.emit("me",socket.id);
    console.log(socket.id);

    socket.on("calluser",({signalData,from,name,idToCall}) => {
        io.to(idToCall).emit("calluser",{from,name,signalData});
    })

    socket.on("answerUser",({signal,to,calledUsername}) => {
        io.to(to).emit("callAccepted",{signal,name:calledUsername});
    })
})
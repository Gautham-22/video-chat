import React from "react";

import VideoPlayer from "./components/VideoPlayer.js";
import Sidebar from "./components/Sidebar.js";
import Notifications from "./components/Notifications.js";
import {ContextProvider} from "./Context.js";

const App = () => {
    return (
        <ContextProvider>
            <VideoPlayer />
            <Sidebar />
            <Notifications />
        </ContextProvider>
    );
};

export default App;
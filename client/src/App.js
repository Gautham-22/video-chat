import React from "react";

import VideoPlayer from "./components/VideoPlayer.js";
import Sidebar from "./components/Sidebar.js";
import Notifications from "./components/Notifications.js";
import {ContextProvider} from "./Context.js";

const App = () => {  // wrapping with context provider will enable access of states to child components
    return (
        <ContextProvider> 
            <VideoPlayer />
            <Sidebar />
            <Notifications />
        </ContextProvider>
    );
};

export default App;
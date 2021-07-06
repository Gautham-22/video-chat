import React from "react";

import "./App.css";

import VideoPlayer from "./components/VideoPlayer.js";
import Sidebar from "./components/Sidebar.js";
import Notifications from "./components/Notifications.js";
import Header from "./components/Header.js";
import {ContextProvider} from "./Context.js";

const App = () => {  // wrapping with context provider will enable access of states to child components
    return (
        <ContextProvider> 
            <Header />
            <div className="container">
                <Notifications />
                <VideoPlayer />
                <Sidebar />
            </div>
        </ContextProvider>
    );
};

export default App;
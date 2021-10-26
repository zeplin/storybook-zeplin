import React, { FunctionComponent, useState } from "react";

import ZeplinPanel from "./ZeplinPanel";
import { ZeplinLink } from "../types/ZeplinLink";
import { PATForm } from "./PATForm";
import { isLoggedIn, login, logout } from "../utils/api";



interface MainPanelProps {
    zeplinLink: ZeplinLink[] | string;
}

export const MainPanel: FunctionComponent<MainPanelProps> = ({ zeplinLink }) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
    if (!loggedIn) {
        return <PATForm onSubmit={(newToken) => {
            login(newToken);
            setLoggedIn(true);
        }} />;
    }
    return <ZeplinPanel zeplinLink={zeplinLink} onLogout={() => {
        logout();
        setLoggedIn(false);
    }} />;
}

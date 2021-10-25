import React, { FunctionComponent, useState } from "react";

import ZeplinPanel from "./ZeplinPanel";
import { ZeplinLink } from "../types/ZeplinLink";
import { PATForm } from "./PATForm";
import { getZeplinToken, setZeplinToken } from "../utils/api";



interface MainPanelProps {
    zeplinLink: ZeplinLink[] | string;
}

export const MainPanel: FunctionComponent<MainPanelProps> = ({ zeplinLink }) => {
    const [token, setToken] = useState<string>(getZeplinToken());
    if (!token) {
        return <PATForm onSubmit={(newToken) => {
            setToken(newToken);
            setZeplinToken(newToken);
        }} />;
    }
    return <ZeplinPanel zeplinLink={zeplinLink} />;
}

import React, { FunctionComponent, useState } from "react";
import { styled } from "storybook/theming";

import ZeplinPanel from "./ZeplinPanel";
import { ZeplinLink } from "../types/ZeplinLink";
import { PATForm } from "./PATForm";
import { isLoggedIn, login, logout } from "../utils/api";

interface MainPanelProps {
    zeplinLink: ZeplinLink[] | string;
}

export const MainPanel: FunctionComponent<MainPanelProps> = ({
    zeplinLink,
}) => {
    const [loggedIn, setLoggedIn] = useState<boolean>(isLoggedIn());
    return (
        <Container>
            {loggedIn ? (
                <ZeplinPanel
                    zeplinLink={zeplinLink}
                    onLogout={() => {
                        logout();
                        setLoggedIn(false);
                    }}
                />
            ) : (
                <PATForm
                    onSubmit={(newToken) => {
                        login(newToken);
                        setLoggedIn(true);
                    }}
                />
            )}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    background: ${({ theme }) => theme.background.content};
    height: 100%;
`;

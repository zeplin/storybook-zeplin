import React, { useEffect, useCallback, useReducer } from "react";
import { Form, Link } from "@storybook/components";
import { styled } from "@storybook/theming";

import HeaderButtons from "./HeaderButtons";

import { getConnectedComponents, getUser, getZeplinResource } from "../utils/api";
import { relativeDate } from "../utils/date";
import OverlayPanel from "./OverlayPanel";
import { ZeplinLink } from "../types/ZeplinLink";
import { Component, User, Screen } from "@zeplin/sdk";
import { useStorybookState } from "@storybook/api";

interface ZeplinPanelProps {
    zeplinLink: ZeplinLink[] | string;
    onLogout: () => void;
}

interface ZeplinState {
    selectedLink: string;
    zeplinData: Component | Screen | null;
    user: User | null;
    zoomLevel: number;
    loading: boolean;
    error: string | null;
    connectedComponents: string[] | null;
}

const initialState: ZeplinState = {
    selectedLink: "",
    zeplinData: null,
    user: null,
    zoomLevel: 1,
    loading: true,
    error: null,
    connectedComponents: null
};

const toLinks = (link: ZeplinLink[] | string | undefined): ZeplinLink[] =>{
    if (!link) {
        return [];
    }
    if (typeof link === "string") {
        return [{ link, name: "Component" }];
    }
    return link;
}

const ZeplinPanel: React.FC<ZeplinPanelProps> = ({ zeplinLink, onLogout }) => {
    const [state, setState] = useReducer(
        (state: ZeplinState, newState: Partial<ZeplinState>) => ({
            ...state,
            ...newState,
        }),
        initialState
    );

    const { storyId } = useStorybookState();

    const { selectedLink, zeplinData, zoomLevel, loading, error, user, connectedComponents } = state;

    const links = toLinks(zeplinLink);
    const designLink = selectedLink || links[0]?.link || connectedComponents?.[0];

    const fetchZeplinResource = async () => {
        // If the connected components are not loaded yet, we need to load them first
        if (!connectedComponents && !designLink) {
            return;
        }

        if (!designLink) {
            const formattedValue = JSON.stringify(zeplinLink, null, 2);
            setState({
                loading: false,
                error: `Zeplin links are either missing or malformed. Received ${formattedValue}`,
            });
            return;
        }

        setState({ loading: true });

        const data = await getZeplinResource(designLink);

        setState({
            loading: false,
            error: 'error' in data ? data.error : undefined,
            zeplinData: 'error' in data ? undefined : data,
        });
    };

    const fetchConnectedComponents = async (storyId) => {
        const data = await getConnectedComponents(storyId);

        setState({
            error: 'error' in data ? data.error : undefined,
            connectedComponents: 'error' in data ? undefined : data,
        });
    };

    const fetchUser = async () => {
        const data = await getUser();

        setState({
            user: 'error' in data ? undefined : data,
        });
    }

    useEffect(() => {
        fetchZeplinResource();
    }, [zeplinLink, selectedLink, connectedComponents]);

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        setState({ connectedComponents: null });
        fetchConnectedComponents(storyId);
    }, [storyId]);

    const selectZeplinLink = useCallback((event) => {
        setState({ selectedLink: event.target.value });
    }, []);

    const handleZoomIn = () => {
        setState({ zoomLevel: zoomLevel * 1.25 });
    };

    const handleZoomOut = () => {
        setState({ zoomLevel: zoomLevel * 0.75 });
    };

    const handleZoomReset = () => {
        setState({ zoomLevel: 1 });
    };

    if (loading) {
        return <Message>Loading…</Message>;
    }

    if (error) {
        return (
            <Rows>
                <p>
                    {error}
                </p>
                <p>
                    {user?.username && <>
                        {"You are currently logged in as "}
                        <strong>{user?.username}</strong>
                        {". "}
                    </>}
                    {"If you prefer using another account, you can "}
                    <Link onClick={onLogout}>
                        log out
                    </Link>
                    {" first."}
                </p>
            </Rows>
        );
    }

    if (!designLink) {
        return (
            <Message>
                <strong>zeplinLink</strong> is not provided for this story.
            </Message>
        );
    }

    if (!zeplinData) {
        return (
            <Message>
                <strong>zeplinData</strong> is not provided for this story.
            </Message>
        );
    }

    const {
        name,
        image: { originalUrl, width, height },
        description,
        updated,
    } = zeplinData;

    const combinedLinks = (
        links.length > 0
            ? links
            : connectedComponents.map((link, i) => ({ link, name: `Component ${i+1}`}))
    );


    const LinksSection = combinedLinks.length > 1 && (
        <Select onChange={selectZeplinLink} value={designLink}>
            {combinedLinks.map(
                ({ name, link }) => (
                    <option key={name} value={link}>
                        {name}
                    </option>
                )
            )}
        </Select>
    );

    return (
        <Container>
            <Header>
                {LinksSection}
                <ResourceName title={name}>{name}</ResourceName>
                {updated && <i>Updated {relativeDate(updated * 1000)}</i>}
                <HeaderButtons
                    username={user?.username}
                    onLogout={onLogout}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onZoomReset={handleZoomReset}
                />
            </Header>

            <Divider />

            <Header>
                <OverlayPanel imageUrl={originalUrl}/>
            </Header>

            <Divider />

            <ImageContainer>
                <a
                    href={designLink}
                    rel="noopener noreferrer"
                    target="_blank"
                    title={name}
                >
                    <img
                        style={{ transform: `scale(${zoomLevel})` }}
                        src={originalUrl}
                        alt={name}
                        width={width}
                        height={height}
                    />
                </a>
            </ImageContainer>
            {description && <Footer>{description}</Footer>}
        </Container>
    );
};

export default ZeplinPanel;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
`;

const ResourceName = styled.strong`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
    margin-right: 15px;
`;

const ImageContainer = styled.div`
    overflow: auto;
    flex: 1;
    padding: 0 15px 15px;
    img {
        transform-origin: left top 0px;
    }
`;

const Divider = styled.hr`
    margin: 0 0 1px 0;
    &:last-of-type {
        margin-bottom: 15px;
    }
`;

const Message = styled.p`
    margin: 15px;
`;

const Rows = styled.div`
    margin: 15px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    p {
        margin: 0;
    }
    p:first-of-type {
        color: red;
    }
`;

const Select = styled(Form.Select)`
    margin-right: 15px;
`;

const Footer = styled.footer`
    padding: 12px 15px;
    background-color: #f6f9fc;
`;

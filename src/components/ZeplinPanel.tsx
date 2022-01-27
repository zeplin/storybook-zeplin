import React, { useEffect, useCallback, useReducer } from "react";
import { Form, Link } from "@storybook/components";
import { styled } from "@storybook/theming";

import HeaderButtons from "./HeaderButtons";

import { getUser, getZeplinResource } from "../utils/api";
import { relativeDate } from "../utils/date";
import OverlayPanel from "./OverlayPanel";
import { ZeplinLink } from "../types/ZeplinLink";
import { Component, User, Screen } from "@zeplin/sdk";
import { useLinks } from "./hooks";

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
    linksFromConnectedComponents: string[] | null;
}

const initialState: ZeplinState = {
    selectedLink: "",
    zeplinData: null,
    user: null,
    zoomLevel: 1,
    loading: true,
    error: null,
    linksFromConnectedComponents: null
};

const ZeplinPanel: React.FC<ZeplinPanelProps> = ({ zeplinLink, onLogout }) => {
    const [state, setState] = useReducer(
        (state: ZeplinState, newState: Partial<ZeplinState>) => ({
            ...state,
            ...newState,
        }),
        initialState,
        undefined
    );

    const { links, loading: linksLoading, error: LinksError } = useLinks(zeplinLink);

    const { selectedLink, zeplinData, zoomLevel, loading, error, user } = state;

    const designLink = selectedLink || links[0]?.link;

    const fetchZeplinResource = async () => {
        // If the connected components are not loaded yet, we need to load them first
        if (linksLoading) {
            return;
        }

        if (!designLink) {
            setState({ loading: false });
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

    const fetchUser = async () => {
        const data = await getUser();

        setState({
            user: 'error' in data ? undefined : data,
        });
    }

    useEffect(() => {
        fetchZeplinResource();
    }, [designLink, linksLoading]);

    useEffect(() => {
        fetchUser();
    }, []);

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

    if (loading || linksLoading) {
        return <Message>Loading…</Message>;
    }


    if (!designLink && !LinksError) {
        if (zeplinLink) {
            return (
                <Message>
                    There is no connected component for this story.
                </Message>
            );
        }
        return (
            <Message>
                <strong>zeplinLink</strong> is not provided for this story.
            </Message>
        );
    }

    if (error || LinksError) {
        return (
            <Rows>
                <p>
                    {error || LinksError}
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

    const LinksSection = links.length > 1 && (
        <Select onChange={selectZeplinLink} value={designLink}>
            {links.map(
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
                <OverlayPanel imageUrl={originalUrl} />
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

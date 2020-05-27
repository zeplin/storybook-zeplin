import React, { useEffect, useCallback, useReducer } from "react";
import { styled } from "@storybook/theming";

import { getZeplinResource } from "../utils/api";
import HeaderButtons from "./HeaderButtons";

interface ZeplinkLink {
    name: string;
    link: string;
}

interface ZeplinPanelProps {
    zeplinLink: ZeplinkLink[] | string;
}

interface ZeplinData {
    name: string;
    image: {
        original_url: string;
    };
    updated: number;
}

interface ZeplinState {
    selectedLink: string;
    zeplinData: ZeplinData | null;
    zoomLevel: number;
    loading: boolean;
    error: string | null;
}

const initialState: ZeplinState = {
    selectedLink: "",
    zeplinData: null,
    zoomLevel: 1,
    loading: true,
    error: null,
};

const ZeplinPanel: React.FC<ZeplinPanelProps> = ({ zeplinLink }) => {
    const [state, setState] = useReducer(
        (state: ZeplinState, newState: Partial<ZeplinState>) => ({
            ...state,
            ...newState,
        }),
        initialState
    );

    const { selectedLink, zeplinData, zoomLevel, loading, error } = state;

    const fetchZeplinResource = async () => {
        const designLink =
            selectedLink ||
            (Array.isArray(zeplinLink) ? zeplinLink[0].link : zeplinLink);

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
            error: data?.error,
            zeplinData: data,
        });
    };

    useEffect(() => {
        fetchZeplinResource();
    }, [zeplinLink, selectedLink]);

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

    if (!zeplinLink || zeplinLink.length <= 0) {
        return (
            <Message>
                <strong>zeplinLink</strong> is not provided for this story.
            </Message>
        );
    }

    if (loading) {
        return <Message>Loading…</Message>;
    }

    if (error) {
        return <Message>{error}</Message>;
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
        image: { original_url },
        updated,
    } = zeplinData;

    const lastUpdatedAt = `${new Date(
        updated * 1000
    ).toLocaleDateString()} at ${new Date(
        updated * 1000
    ).toLocaleTimeString()}`;

    const LinksSection = Array.isArray(zeplinLink) && (
        <select onChange={selectZeplinLink} value={selectedLink}>
            {(zeplinLink as ZeplinkLink[]).map(
                ({ name, link }: ZeplinkLink) => (
                    <option key={name} value={link}>
                        {name}
                    </option>
                )
            )}
        </select>
    );

    return (
        <Container>
            <Header>
                {LinksSection}
                <strong>{name}</strong>
                <i>Last updated: {lastUpdatedAt}</i>
                <HeaderButtons
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onZoomReset={handleZoomReset}
                />
            </Header>

            <Divider />

            <ImageContainer>
                <a
                    href={selectedLink}
                    rel="noopener noreferrer"
                    target="_blank"
                    title={name}
                >
                    <img
                        style={{ transform: `scale(${zoomLevel})` }}
                        src={original_url}
                        alt={name}
                    />
                </a>
            </ImageContainer>
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

const ImageContainer = styled.div`
    overflow: auto;
    flex: 1;
    padding: 0 15px 15px;
    img {
        transform-origin: left top 0px;
    }
`;

const Divider = styled.hr`
    margin: 0 0 15px 0;
`;

const Message = styled.p`
    margin: 15px;
`;

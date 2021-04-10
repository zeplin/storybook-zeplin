import React, { useEffect, useCallback, useReducer } from "react";
import { styled } from "@storybook/theming";

import HeaderButtons from "./HeaderButtons";

import { getZeplinResource } from "../utils/api";
import { relativeDate } from "../utils/date";
import OverlayPanel from "./OverlayPanel";

interface ZeplinkLink {
    name: string;
    link: string;
}

interface ZeplinPanelProps {
    zeplinLink: ZeplinkLink[] | string;
}

interface ZeplinData {
    name: string;
    description: string;
    image: {
        width: number;
        height: number;
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
    const designLink = (Array.isArray(zeplinLink) ? selectedLink || zeplinLink[0]?.link : zeplinLink);

    const fetchZeplinResource = async () => {
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
        image: { original_url, width, height },
        description,
        updated,
    } = zeplinData;

    const LinksSection = Array.isArray(zeplinLink) && (
        <Select onChange={selectZeplinLink} value={designLink}>
            {(zeplinLink as ZeplinkLink[]).map(
                ({ name, link }: ZeplinkLink) => (
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
                <i>Updated {relativeDate(updated * 1000)}</i>
                <HeaderButtons
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onZoomReset={handleZoomReset}
                />
            </Header>

            <Divider />

            <Header>
                <OverlayPanel imageUrl={original_url}/>
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
                        src={original_url}
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

const Select = styled.select`
    margin-right: 15px;
`;

const Footer = styled.footer`
    padding: 12px 15px;
    background-color: #f6f9fc;
`;

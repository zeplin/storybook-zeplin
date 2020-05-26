import React, { useEffect, useState, useCallback } from "react";
import { styled } from "@storybook/theming";

import { getZeplinResource } from "../utils/api";
import HeaderButtons from "./HeaderButtons";

interface ZeplinkLink {
    name: string;
    link: string;
}

interface ZeplinPanelProps {
    zeplinLink: ZeplinkLink[];
}

const ZeplinPanel: React.FC<ZeplinPanelProps> = ({ zeplinLink }) => {
    const [selectedLink, setSelectedLink] = useState("");
    const [zeplinData, setZeplinData] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchZeplinResource = async () => {
        const designLink = selectedLink || zeplinLink[0].link;

        if (!designLink) {
            const formattedValue = JSON.stringify(zeplinLink, null, 2);
            setLoading(false);
            setError(
                `The zeplin links are either missing or malformed. Received ${formattedValue}`
            );
            return;
        }

        setLoading(true);

        const data = await getZeplinResource(designLink);

        setLoading(false);
        setError(data?.error);
        setZeplinData(data);
    };

    useEffect(() => {
        fetchZeplinResource();
    }, [zeplinLink, selectedLink]);

    const selectZeplinLink = useCallback((event) => {
        setSelectedLink(event.target.value);
    }, []);

    const handleZoomIn = () => {
        setZoomLevel(zoomLevel * 1.25);
    };

    const handleZoomOut = () => {
        setZoomLevel(zoomLevel * 0.75);
    };

    const handleZoomReset = () => {
        setZoomLevel(1);
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

    const lastModifiedAt = `${new Date(
        updated * 1000
    ).toLocaleDateString()} at ${new Date(
        updated * 1000
    ).toLocaleTimeString()}`;

    const Links = zeplinLink.map((design: ZeplinkLink) => (
        <option key={design.name} value={design.link}>
            {design.name}
        </option>
    ));

    return (
        <Container>
            <Header>
                <select onChange={selectZeplinLink} value={selectedLink}>
                    {Links}
                </select>
                <strong>{name}</strong>
                <i>last updated {lastModifiedAt}</i>
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

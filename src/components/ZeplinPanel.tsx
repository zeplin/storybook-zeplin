import React, { useEffect, useState } from "react";
import { useParameter } from "@storybook/api";
import { styled } from "@storybook/theming";

import HeaderButtons from "./HeaderButtons";
import { PARAM_KEY } from "../constants";
import { getZeplinResource } from "../utils/api";

interface ZeplinData {
    name: string;
    image: {
        original_url: string;
    };
}

const ZeplinPanel = () => {
    const [zeplinData, setZeplinData] = useState<ZeplinData | null>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [zoomLevel, setZoomLevel] = useState(1);
    const zeplinLink = useParameter(PARAM_KEY, null);

    useEffect(() => {
        async function getData() {
            const data = await getZeplinResource(zeplinLink);

            if (data && data.error) {
                setError(data.error);
            } else if (data) {
                setZeplinData(data);
                setError(null);
            }

            setLoading(false);
        }

        if (zeplinLink) {
            getData();
        }
    }, [zeplinLink]);

    if (!zeplinLink) {
        return (
            <Message>
                <strong>zeplinLink</strong> parameter is not provided for this
                story.
            </Message>
        );
    }

    if (loading) {
        return <Message>Loading…</Message>;
    }

    if (error) {
        return <Message>{error}</Message>;
    }

    const {
        name,
        image: { original_url },
    } = zeplinData;

    const onZoomIn = () => setZoomLevel((prevState) => prevState * 1.25);
    const onZoomOut = () => setZoomLevel((prevState) => prevState * 0.75);
    const onZoomReset = () => setZoomLevel(1);

    return (
        <Container>
            <Header>
                <strong>{name}</strong>
                <HeaderButtons
                    onZoomIn={onZoomIn}
                    onZoomOut={onZoomOut}
                    onZoomReset={onZoomReset}
                />
            </Header>

            <Divider />

            <ImageContainer>
                <a
                    href={zeplinLink}
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

import React, { Component } from "react";
import { styled } from "@storybook/theming";

import HeaderButtons from "./HeaderButtons";
import { getZeplinResource } from "../utils/api";

interface ZeplinPanelProps {
    zeplinLink: string;
}

interface ZeplinPanelStates {
    zeplinData: {
        name: string;
        image: {
            original_url: string;
        };
    };
    loading: boolean;
    error: string;
    zoomLevel: number;
}

class ZeplinPanel extends Component<ZeplinPanelProps, ZeplinPanelStates> {
    constructor(props) {
        super(props);

        this.state = {
            zeplinData: null,
            loading: true,
            error: null,
            zoomLevel: 1,
        };
    }

    componentDidMount() {
        getZeplinResource(this.props.zeplinLink).then(data => {
            this.setState({
                loading: false,
                error: data && data.error,
                zeplinData: data,
            });
        });
    }

    handleZoomIn = () => {
        this.setState(({ zoomLevel }) => ({
            zoomLevel: zoomLevel * 1.25,
        }));
    }

    handleZoomOut = () => {
        this.setState(({ zoomLevel }) => ({
            zoomLevel: zoomLevel * 0.75,
        }));
    }

    handleZoomReset = () => {
        this.setState({
            zoomLevel: 1,
        });
    }

    render() {
        const { zeplinLink } = this.props;
        const { loading, error, zeplinData, zoomLevel } = this.state;

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

        return (
            <Container>
                <Header>
                    <strong>{name}</strong>
                    <HeaderButtons
                        onZoomIn={this.handleZoomIn}
                        onZoomOut={this.handleZoomOut}
                        onZoomReset={this.handleZoomReset}
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
    }
}

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

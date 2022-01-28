import React, { FunctionComponent, useState } from "react";
import { Button, Form, Icons, Link } from "@storybook/components";
import { styled } from "@storybook/theming";

interface PATFormProps {
    onSubmit: (value: string) => void
}

export const PATForm: FunctionComponent<PATFormProps> = ({ onSubmit }) => {
    const [token, setToken] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(token);
    };
    return (
        <Rows>
            <StyledForm onSubmit={handleSubmit}>
                <StyledInput
                    value={token}
                    placeholder="Personal access token"
                    onChange={({ target }) => setToken((target as any)?.value)}
                />
                <Button type="submit" primary small>
                    Save
                </Button>
            </StyledForm>
            <div>
                You can create personal access token using
                {" "}
                <Link
                    cancel={false}
                    href={"https://app.zeplin.io/profile/developer"}
                    target="_blank"
                    rel="noopener noreferrer">
                    Developer
                </Link>
                {" "}
                page in your Zeplin profile.
            </div>
            <FillerRow />
            <small>
                <i>* The token will be stored in your browser's local storage. You can later remove it using the log out button</i>
            </small>
        </Rows>
    );
}

const Rows = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    height: 100%;
`;

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: row;
    gap: 15px;
`;

const StyledInput = styled(Form.Input)`
    flex: 1;
`;

const FillerRow = styled.div`
    flex: 1;
`;


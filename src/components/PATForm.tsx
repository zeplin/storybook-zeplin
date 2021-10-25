import React, { FunctionComponent, useState } from "react";
import { Button, Form, Link } from "@storybook/components";
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
    return <Rows>
        <StyledForm onSubmit={handleSubmit}>
            <Form.Input value={token} onChange={({ target }) => setToken((target as any)?.value)} />
            <Button type="submit" primary small>
                Set Personal Access Token
            </Button>
        </StyledForm>
        <div>
            You can create personal access token from the web app under
            {" "}
            <Link
                cancel={false}
                href={"https://app.zeplin.io/profile/developer"}
                target="_blank"
                rel="noopener noreferrer">
                Developer
            </Link>
            {" "}
            tab in your profile page.
        </div>
    </Rows>
}

const Rows = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const StyledForm = styled(Form)`
    display: flex;
    flex-direction: row;
    gap: 15px;
`

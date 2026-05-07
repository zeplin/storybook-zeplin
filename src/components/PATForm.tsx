import React, {
    ChangeEvent,
    FormEvent,
    FunctionComponent,
    useState,
} from "react";
import { Button, Form, Link } from "storybook/internal/components";
import { styled } from "storybook/theming";

interface PATFormProps {
    onSubmit: (value: string) => void;
}

export const PATForm: FunctionComponent<PATFormProps> = ({ onSubmit }) => {
    const [token, setToken] = useState("");
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(token);
    };
    return (
        <Rows>
            <StyledForm onSubmit={handleSubmit}>
                <StyledInput
                    value={token}
                    placeholder="Personal access token"
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setToken(event.target.value)
                    }
                />
                <Button type="submit" variant="solid" size="small">
                    Save
                </Button>
            </StyledForm>
            <div>
                Create a personal access token on the{" "}
                <Link
                    cancel={false}
                    href={"https://app.zeplin.io/profile/developer"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Developer
                </Link>{" "}
                page of your Zeplin profile.
            </div>
            <FillerRow />
            <small>
                <i>
                    Your token is stored in your browser's local storage. Log
                    out to remove it.
                </i>
            </small>
        </Rows>
    );
};

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

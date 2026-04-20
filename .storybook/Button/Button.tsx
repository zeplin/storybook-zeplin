import { PropsWithChildren } from "react";
import "./style.css";

interface ButtonProps {
    active?: boolean;
    disabled?: boolean;
}

export default function Button({
    active,
    disabled,
    children,
}: PropsWithChildren<ButtonProps>) {
    return (
        <button className={active ? "active" : ""} disabled={disabled}>
            {children}
        </button>
    );
}

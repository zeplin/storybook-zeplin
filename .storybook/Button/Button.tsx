import { ReactNode } from "react";
import "./style.css";

interface ButtonProps {
    active?: boolean;
    disabled?: boolean;
    children?: ReactNode;
}

export default function Button({ active, disabled, children }: ButtonProps) {
    return (
        <button className={active ? "active" : ""} disabled={disabled}>
            {children}
        </button>
    );
}

import { PARENT_ORIGIN } from "../constants";

export function postMessage(action: string, payload: any): void {
    window.parent.postMessage(
        {
            source: "storybook-zeplin-addon",
            action,
            payload
        },
        PARENT_ORIGIN
    );
}

export function postError(action: string, error: any): void {
    window.parent.postMessage(
        {
            source: "storybook-zeplin-addon",
            action,
            error
        },
        PARENT_ORIGIN
    );
}

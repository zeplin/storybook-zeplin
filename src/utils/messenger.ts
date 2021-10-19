import { PARENT_ORIGIN } from "../constants";

type Responder = (data: any) => any;

const ADDON_SOURCE_NAME = "storybook-zeplin-addon";

class Messenger {
    responderMap: Map<string, Responder>;
    constructor() {
        this.responderMap = new Map<string, Responder>();

        window.addEventListener("message", async ({ data, origin }) => {
            const action = data?.action;
            if (origin === PARENT_ORIGIN && data?.to === ADDON_SOURCE_NAME && this.responderMap.has(action)) {
                try {
                    const response = this.responderMap.get(action)(data);
                    this.postMessage(action, response);
                } catch (e) {
                    this.postError(
                        action,
                        {
                            message: e?.message || e || "Unknown error"
                        }
                    );
                }
            }
        })
    }

    postMessage(action: string, payload?: any): void {
        window.parent.postMessage(
            {
                source: ADDON_SOURCE_NAME,
                action,
                payload
            },
            PARENT_ORIGIN
        );
    }

    postError(action: string, error: any): void {
        window.parent.postMessage(
            {
                source: ADDON_SOURCE_NAME,
                action,
                error
            },
            PARENT_ORIGIN
        );
    }

    respondOnMessage(action: string, responder: Responder) {
        this.responderMap.set(action, responder);
    }
}

export const messenger = new Messenger();

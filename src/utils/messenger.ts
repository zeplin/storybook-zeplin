import { PARENT_ORIGIN } from "../constants";

type Responder = (data: any) => any;

class Messenger {
    respondMapper: Map<string, Responder>;
    constructor() {
        this.respondMapper = new Map<string, Responder>();

        window.addEventListener("message", async ({ data, origin }) => {
            const action = data?.action;
            if (origin === PARENT_ORIGIN && data?.to ===  "storybook-zeplin-addon" && this.respondMapper.has(action)) {
                try {
                    const response = this.respondMapper.get(action)(data);
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
                source: "storybook-zeplin-addon",
                action,
                payload
            },
            PARENT_ORIGIN
        );
    }

    postError(action: string, error: any): void {
        window.parent.postMessage(
            {
                source: "storybook-zeplin-addon",
                action,
                error
            },
            PARENT_ORIGIN
        );
    }

    respondOnMessage(action: string, responder: (data: any) => any) {
        this.respondMapper.set(action, responder);
    }
}

export const messenger = new Messenger();

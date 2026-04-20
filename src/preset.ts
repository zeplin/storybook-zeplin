import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const managerEntries = (entry: string[] = []): string[] => [
    ...entry,
    join(__dirname, "manager.js"),
];

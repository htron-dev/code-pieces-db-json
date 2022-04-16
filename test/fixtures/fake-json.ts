import path from "path";
import fs from "fs";

export function createFakeJson(data: any) {
    const filename = path.resolve(__dirname, "..", "..", "tmp", "test.json");

    fs.mkdirSync(path.dirname(filename), { recursive: true });

    fs.writeFileSync(filename, JSON.stringify(data));

    return filename;
}

export async function removeFakeJson() {
    const filename = path.resolve(__dirname, "..", "..", "tmp");

    if (fs.existsSync(filename)) {
        fs.rmSync(filename, { recursive: true });
    }
}

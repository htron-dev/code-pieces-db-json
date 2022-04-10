import fs from "fs";

export class Table {
    public all = [];

    public static async load(filename: string) {
        const exists = await fs.promises
            .stat(filename)
            .then(() => true)
            .catch(() => false);

        if (!exists) {
            throw new Error(`File ${filename} not found`);
        }

        const data = await fs.promises.readFile(filename, "utf8");

        const table = new Table();

        table.all = JSON.parse(data);

        return table;
    }

    public get length() {
        return this.all.length;
    }
}

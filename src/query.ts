import fs from "fs";

export class Query {
    public data = [];
    public fields: string[] = [];
    public filters: [string, any][] = [];

    constructor(data: any[]) {
        this.data = data;
    }

    public static async from(filename: string) {
        const exists = await fs.promises
            .stat(filename)
            .then(() => true)
            .catch(() => false);

        if (!exists) {
            throw new Error(`File ${filename} not found`);
        }

        const data = fs.readFileSync(filename, "utf8");

        return new Query(JSON.parse(data));
    }

    private _map(row: any) {
        const result = {};

        if (!this.fields.length) {
            return row;
        }

        this.fields.forEach((field) => {
            result[field] = row[field];
        });

        return result;
    }

    private _filter(row: any) {
        return this.filters.every(([field, value]) => row[field] === value);
    }

    public value<T>() {
        const result = this.data
            .map((row) => this._map(row))
            .filter((row) => this._filter(row));

        return result as unknown as T;
    }

    public select(...fields: string[]) {
        this.fields.push(...fields);

        return this;
    }

    public where(field: string, value: any) {
        this.filters.push([field, value]);
        return this;
    }
}

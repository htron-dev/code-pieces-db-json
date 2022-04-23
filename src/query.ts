import fs from "fs";

export class Query<T = any[]> extends Promise<T> {
    public _filename: string;
    public _result = [];
    public _whereStatement: any[][] = [];
    public _fieldsStatement: string[] = [];

    private _queryResolve: Function;
    public _queryReject: Function;

    constructor(executor = (_resolve: Function, _reject: Function) => {}) {
        let resolve: Function;
        let reject: Function;

        super((rs, rj) => {
            resolve = rs;
            reject = rj;
            executor(rs, rj);
        });

        this._queryResolve = resolve;
        this._queryReject = reject;

        setTimeout(() => this.resolveQuery(), 0);

        return this;
    }

    public resolveQuery() {
        let result = this._result.filter((row) =>
            this._whereStatement.every(([field, value]) => row[field] === value)
        );

        if (this._fieldsStatement.length) {
            result = result.map((row) =>
                Object.keys(row)
                    .filter((field) => this._fieldsStatement.includes(field))
                    .reduce((r, field) => ({ ...r, [field]: row[field] }), {})
            );
        }

        this._queryResolve(result);
    }

    public static from(filename: string) {
        const query = new Query();

        const exists = fs.existsSync(filename);

        if (!exists) {
            query._queryReject(new Error(`File ${filename} not found`));
            return query;
        }

        const data = fs.readFileSync(filename, "utf8");

        query._result = JSON.parse(data);
        query._filename = filename;

        return query as Query<any[]>;
    }

    public select(...fields: string[]) {
        this._fieldsStatement.push(...fields);

        return this;
    }

    public where(field: string, value: any) {
        this._whereStatement.push([field, value]);
        return this;
    }

    public findBy(field: string, value: any) {
        const result = this._result.find((row) => row[field] === value);

        return result || null;
    }

    public async insert(data: any) {
        const all: any[] = await Query.from(this._filename);

        all.push(data);

        await fs.promises.writeFile(
            this._filename,
            JSON.stringify(all, null, 2)
        );

        return Promise.resolve(data);
    }

    public async update(data: any) {
        const all = await Query.from(this._filename);

        const result = all.map((item) => {
            const match = this._whereStatement.every(
                ([field, value]) => item[field] === value
            );

            if (match) {
                return { ...item, ...data };
            }

            return item;
        });

        await fs.promises.writeFile(
            this._filename,
            JSON.stringify(result, null, 2)
        );

        return Promise.resolve(data);
    }
}

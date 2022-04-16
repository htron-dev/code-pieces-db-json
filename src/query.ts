import fs from "fs";

export class Query<T> extends Promise<T> {
    public _result = [];

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

        setTimeout(() => this._queryResolve(this._result), 0);

        return this;
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

        return query as Query<any>;
    }

    public select(...fields: string[]) {
        this._result = this._result.map((row) =>
            Object.keys(row)
                .filter((field) => fields.includes(field))
                .reduce((r, field) => ({ ...r, [field]: row[field] }), {})
        );

        return this;
    }

    public where(field: string, value: any) {
        this._result = this._result.filter((row) => row[field] === value);

        return this;
    }

    public findBy(field: string, value: any) {
        const result = this._result.find((row) => row[field] === value);

        return result || null;
    }
}

// hello().then((value) => console.log(value));

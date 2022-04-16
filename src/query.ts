import fs from "fs";

// export class Query {
//     public data = [];
//     public fields: string[] = [];
//     public filters: [string, any][] = [];

//     constructor(data: any[]) {
//         this.data = data;
//     }

//     public static async from(filename: string) {
//         const exists = await fs.promises
//             .stat(filename)
//             .then(() => true)
//             .catch(() => false);

//         if (!exists) {
//             throw new Error(`File ${filename} not found`);
//         }

//         const data = fs.readFileSync(filename, "utf8");

//         return new Query(JSON.parse(data));
//     }

//     private _map(row: any) {
//         const result = {};

//         if (!this.fields.length) {
//             return row;
//         }

//         this.fields.forEach((field) => {
//             result[field] = row[field];
//         });

//         return result;
//     }

//     private _filter(row: any) {
//         return this.filters.every(([field, value]) => row[field] === value);
//     }

//     public value<T>() {
//         const result = this.data
//             .map((row) => this._map(row))
//             .filter((row) => this._filter(row));

//         return result as unknown as T;
//     }

//     public select(...fields: string[]) {
//         this.fields.push(...fields);

//         return this;
//     }

//     public where(field: string, value: any) {
//         this.filters.push([field, value]);
//         return this;
//     }

//     public findBy(field: string, value: any) {
//         const result = this.value<any[]>().find((row) => row[field] === value);

//         return result || null;
//     }
// }

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

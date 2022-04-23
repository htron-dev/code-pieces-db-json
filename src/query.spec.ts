import { createFakeJson, removeFakeJson } from "@/test/fixtures/fake-json";
import { it, expect, afterEach } from "vitest";

import { Query } from "./query";

afterEach(removeFakeJson);

it("should from() read a json file", async () => {
    const filename = createFakeJson([{ id: 1, name: "foo" }]);

    const data = await Query.from(filename);

    expect(data).toEqual([{ id: 1, name: "foo" }]);
});

it("should from() trigger a error if file do not exist", () => {
    const filename = "fake.json";

    expect(Query.from(filename)).rejects.toThrow(`File ${filename} not found`);
});

it("should select() return only fields in the args", async () => {
    const filename = createFakeJson([{ id: 1, name: "foo", age: 18 }]);

    const data = await Query.from(filename).select("name", "age");

    expect(data).toEqual([{ name: "foo", age: 18 }]);
});

it("should where() filter result data", async () => {
    const filename = createFakeJson([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
    ]);

    const data = await Query.from(filename).where("name", "bar");

    expect(data).toEqual([{ id: 2, name: "bar", age: 18 }]);
});

it("should filter and return only fields in the args", async () => {
    const filename = createFakeJson([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
        { id: 3, name: "bar", age: 19 },
    ]);

    const data = await Query.from(filename)
        .select("name", "age")
        .where("name", "bar")
        .where("age", 18);

    expect(data).toEqual([{ name: "bar", age: 18 }]);
});

it("should findBy() return one item by name", () => {
    const filename = createFakeJson([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
    ]);

    const result = Query.from(filename).findBy("name", "bar");

    expect(result).toEqual({ id: 2, name: "bar", age: 18 });
});

it("should findBy() return null if item do not exist", async () => {
    const filename = createFakeJson([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
    ]);

    const result = await Query.from(filename).findBy("name", "baz");

    expect(result).toBeNull();
});

it("should query be able to be updated before the promise resolve", async () => {
    const filename = createFakeJson([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
    ]);

    const query = Query.from(filename);

    query.select("name");

    query.where("name", "bar");

    const result = await query;

    expect(result).toEqual([{ name: "bar" }]);
});

it("should add a new item to the array", async () => {
    const filename = createFakeJson([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
    ]);

    await Query.from(filename).insert({ id: 3, name: "baz", age: 18 });

    const result = await Query.from(filename);

    expect(result).toEqual([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
        { id: 3, name: "baz", age: 18 },
    ]);
});

it("should update an item in the array", async () => {
    const filename = createFakeJson([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
    ]);

    await Query.from(filename).where("id", 2).update({ name: "baz" });

    const result = await Query.from(filename);

    expect(result).toEqual([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "baz", age: 18 },
    ]);
});

it("should delete an item from array", async () => {
    const filename = createFakeJson([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
    ]);

    await Query.from(filename).where("id", 2).delete();

    const result = await Query.from(filename);

    expect(result).toEqual([{ id: 1, name: "foo", age: 18 }]);
});

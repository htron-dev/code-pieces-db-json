import { createFakeJson, removeFakeJson } from "@/test/fixtures/fake-json";
import { it, expect, afterEach } from "vitest";

import { Query } from "./query";

afterEach(removeFakeJson);

it("should from() read a json file", async () => {
    const filename = createFakeJson([{ id: 1, name: "foo" }]);

    const query = await Query.from(filename);

    const data = query.value();

    expect(data).toEqual([{ id: 1, name: "foo" }]);
});

it("should from() trigger a error if file do not exist", async () => {
    const filename = "fake.json";

    const promise = () => Query.from(filename);

    await expect(promise()).rejects.toThrow(`File ${filename} not found`);
});

it("should select() return only fields in the args", () => {
    const query = new Query([{ id: 1, name: "foo", age: 18 }]);

    const data = query.select("name", "age").value();

    expect(data).toEqual([{ name: "foo", age: 18 }]);
});

it("should where() filter result data", () => {
    const query = new Query([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
    ]);

    const data = query.where("name", "bar").value();

    expect(data).toEqual([{ id: 2, name: "bar", age: 18 }]);
});

it("should filter and return only fields in the args", () => {
    const query = new Query([
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
        { id: 3, name: "bar", age: 19 },
    ]);

    const data = query
        .select("name", "age")
        .where("name", "bar")
        .where("age", 18)
        .value();

    expect(data).toEqual([{ name: "bar", age: 18 }]);
});

it("should findBy() return one item by name", () => {
    const data = [
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
    ];

    const query = new Query(data);

    const result = query.findBy("name", "bar");

    expect(result).toEqual({ id: 2, name: "bar", age: 18 });
});

it("should findBy() return null if item do not exist", () => {
    const data = [
        { id: 1, name: "foo", age: 18 },
        { id: 2, name: "bar", age: 18 },
    ];

    const query = new Query(data);

    const result = query.findBy("name", "baz");

    expect(result).toBeNull();
});
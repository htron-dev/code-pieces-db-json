import { createFakeJson, removeFakeJson } from "@/test/fixtures/fake-json";
import { it, expect, afterEach } from "vitest";

import { Table } from "./table";

afterEach(removeFakeJson);

it("should load() read a json file", async () => {
    const filename = createFakeJson([{ id: 1, name: "foo" }]);

    const table = await Table.load(filename);

    expect(table).toHaveLength(1);
});

it("should load() trigger a error if file do not exist", async () => {
    const filename = "fake.json";

    const promise = () => Table.load(filename);

    await expect(promise()).rejects.toThrow(`File ${filename} not found`);
});

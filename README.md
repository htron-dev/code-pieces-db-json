<div align="center">

# DB json

Manipule your json files with a [Knexjs](http://knexjs.org/) like builder.

</div>

This piece of code is a lib to read and manipulate json files.

We try to follow the same syntax as **Knexjs** project, so you will have a very clean and nice way to query your data with chain methods and a promise builder.

## Installation

```shell
npm i @code-pieces/db-json@latest
```

## Simple Usage

```js
import { Query } from "@code-pieces/db-json";

Query.from("./users.json").then((users) => {
    console.log("all-users", users);
});

// or using async/await syntax

const users = await Query.from("./users.json");

console.log("all-users", users);

// output : [ { id: 1, name: "Jonathan" }, { id: 2, name: "Dio" }, ... ]
```

## Update the query before it's resolved

```js
import { Query } from "@code-pieces/db-json";

const query = Query.from("./users.json");

query.select("name").where("name", "Dio");

const users = await query;

// output : [ { name: "Dio" } ]
```

## Where method

Filter the array of items by a property and value

```js
const result = await Query.from("./users.json").where("name", "Jonathan");

// output : [ { id: 1, name: "Jonathan" } ]
```

## FindBy method

Return the first founded object or **null** if no one was founded

```js
const result = await Query.from(filename).findBy("name", "Jonathan");

// output : { id: 1, name: "Jonathan" }
```

## Notes & Recomendations

-   This is very useful to make config files that uses json format.
-   This lib is not recommended to deal with a huge amount of data like in big data projects because the database is read and manipulated in runtime.

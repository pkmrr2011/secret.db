# Secret.db

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Securely store sensitive data in a secret database with "secret.db". This npm package provides a robust solution for storing and managing confidential information in a file, ensuring privacy through private encoding

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install Secret.db, use npm:

```
npm install secret.db
```

## Usage

Import the `Database` class from "secret.db" and create a new instance:

```
const Database = require('secret.db');

(async () => {
  try {
    const database = new Database('User');

    // Example: Creating data
    // const result = await database.create(
         // Your data here... data can be anything(string, object, array)
    //  );

    // Example: Finding data
    const result = await database.find();
    console.log(result);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
```

## Examples

### Creating Data

To add new records to your database, use the `create` method provided by the `secret.db` library. In the following example, a `Database` instance is created for the 'User' table, and then the `create` method is called to insert a single record.

```
const Database = require('secret.db');

const database = new Database('User');
const result = await database.create({
    name: "prince",
    age: 24,
    state: "Delhi",
    country: "INDIA",
});

```
#### Handling Multiple Data Entries
For handling multiple data entries, utilize an array of objects with the `create` method.

```
await database.create([
  {
    name: "prince",
    age: 24,
    state: "Delhi",
    country: "INDIA",
  },
  {
    name: "pkmrr",
    age: 23,
    state: "Delhi",
    country: "INDIA",
  }
]);


```

This allows you to insert multiple records in a single operation, improving efficiency when dealing with bulk data.


### Finding Data

To retrieve data from the database, use the `find` method provided by the `secret.db` library. In the following example, a `Database` instance is created for the 'User' table, and then the `find` method is called to retrieve records.

```
const Database = require('secret.db');

const database = new Database('User');
const result = await database.find();
console.log('Found data:', result);

```

#### Customized Data Retrieval

The `find` method allows you to customize your query and options for more targeted data retrieval.

```
await database.find({
  where: {
    name: {
      like: "prin"
    },
    age: {
      or: [
        { gte: 18 },
        { lte: 30 }
      ]
    }
  },
  limit: 10,
  offset: 0
});


```

#### Query Conditions:

The `where` clause supports various conditions such as `eq` (equal), `ne` (not equal), `gt` (greater than), `gte` (greater than or equal to), `lt` (less than), `lte` (less than or equal to), `like` (partial match), `LIKE` (case-sensitive partial match), `or`, and `and`. Customize the `where` clause based on your specific filtering requirements.
**Options:**

   * The `limit` option restricts the number of records returned, providing control over the result set size.
   * The `offset` option skips a specified number of records, useful for implementing pagination.

### Update Data

#### Partial Update
To perform a partial update, use the `update` method with a specified `where` clause and the `data` object containing the new values. In the example below, it updates records where the `name` contains "prin" and the age is either greater than or equal to 18 or less than or equal to 30. The data object updates the name to "Prince Chaudhary."

```
await database.update({
  where: {
    name: {
      like: "prin"
    },
    age: {
      or: [
        { gte: 18 },
        { lte: 30 }
      ]
    }
  },
  data: {
    name: "Prince Chaudhary"
  }
});

```

#### Update Whole Data

To update the entire dataset, use the `update` method with an empty `where` clause. This will apply the specified changes to all records in the database.

```
await database.update({
  where: { },
  data: {
    name: "Prince Chaudhary"
  }
});
```
**Note:** Make sure to exercise caution when using an empty where clause for updates, as it will affect all records in the specified table.

### Delete Data

#### Partial Deletion

To delete specific records, use the `delete` method with a specified `where` clause. In the example below, it deletes records where the `age` is either less than or equal to 18 or greater than or equal to 30.

```
await database.delete({
  where: {
    age: {
      or: [
        { lte: 18 },
        { gte: 30 }
      ]
    }
  },
});

```

#### Delete Whole Data

To delete all records in a dataset, use the `delete` method with an empty `where` clause. This will remove all records from the specified table.
```
await database.delete({
  where: { },
});
```
**Note:** Be cautious when using an empty `where` clause for deletion, as it will delete all records in the specified table.


## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue. Pull requests are encouraged.

## License

[MIT](./LICENSE)

This project is licensed under the MIT License - see the [LICENSE file](./LICENSE) for details.


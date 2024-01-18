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

```
const Database = require('secret.db');

const database = new Database('User');
const result = await database.create({
    name: "prince",
    age: 24,
    state: "Delhi",
    country: "INDIA",
});
console.log('Data created:', result);
```

### Finding Data

```
const Database = require('secret.db');

const database = new Database('User');
const result = await database.find();
console.log('Found data:', result);
```

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue. Pull requests are encouraged.

## License

[MIT](./LICENSE)

This project is licensed under the MIT License - see the [LICENSE file](./LICENSE) for details.


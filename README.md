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

```bash
npm install secret.db

## Usage

Import the `Database` class from "secret.db" and create a new instance:

```bash
const { Database } = require('secret.db');

const { Database } = require('secret.db');

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



## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue. Pull requests are encouraged.

## License

MIT License

Copyright (c) 2024 Prince Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



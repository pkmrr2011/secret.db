const { expect } = require('chai');
const Database = require('./index.js');

describe('Database', () => {
  it('should create and find data', async () => {
    try {
      const database = new Database('Admin');

      // Create test data
      const testData = {
        name: "prince",
        age: 24,
        state: "Delhi",
        country: "INDIA",
      };

      // Example: Creating data
      const createdData = await database.create(testData);

      // Example: Finding data
      const foundData = await database.find();

      // Assertions
      expect(createdData).to.deep.equal(testData); // Ensure created data matches input
      expect(foundData).to.be.an('array').that.includes(testData); // Ensure test data is found

    } catch (error) {
      // Fail the test if an error occurs
      throw error;
    }
  });
});

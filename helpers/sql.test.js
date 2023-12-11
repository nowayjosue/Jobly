const { expect } = require('chai');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
  }
}

/**
 * Generates SQL for partial updates based on the provided data and column mapping.
 * @param {Object} dataToUpdate - An object containing the data to be updated.
 * @param {Object} jsToSql - A mapping of JavaScript property names to their corresponding SQL column names.
 * @returns {Array} An array of SQL update statements.
 * @throws {BadRequestError} If no data is provided for the update.
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);

  // Check if dataToUpdate is empty
  if (keys.length === 0) {
    throw new BadRequestError("No data");
  }

  // Generate SQL update statements
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return cols;
}

// Unit tests using Mocha and Chai
describe('sqlForPartialUpdate', () => {
  it('should generate SQL for partial update with valid data and mapping', () => {
    const dataToUpdate = { firstName: 'Aliya', age: 32 };
    const jsToSql = { firstName: 'first_name' };

    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

    // The result should be an array with the correct SQL statements
    expect(result).to.deep.equal(['"first_name"=$1', '"age"=$2']);
  });

  it('should throw BadRequestError if no data is provided', () => {
    const dataToUpdate = {};
    const jsToSql = {};

    // Using a function to check the error due to throw syntax
    const testFunction = () => sqlForPartialUpdate(dataToUpdate, jsToSql);

    // The function should throw BadRequestError
    expect(testFunction).to.throw(BadRequestError, 'No data');
  });

  // Add more tests to cover edge cases and variations
});
const jestConfig = require("..jest.config.json");

module.exports = {
  ...jestConfig,
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/$1",
    "^@common/(.*)$": "<rootDir>/common/$1",
    "^@modules/(.*)$": "<rootDir>/modules/$1"
  }
};
